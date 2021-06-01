const fetch = require('node-fetch');
const {
  getBrowser,
  cookiesParser,
  getPage,
  getCookies,
} = require('../../utils/page');
const { selectMode } = require('../../utils/questions');
const { getFormData } = require('../../utils/formData');
const path = require('path');
const mkdirp = require('mkdirp');

// utils
const { delay } = require('../../utils/utils');

// file apis
const { writeFileAsync, download } = require('../../utils/fileAPI');

const Store = {
  browser: null,
  currentPage: null,
  token: null,
  cookie: null,
}

const WHOLESALE_URL = "https://bellavka.by/type/wholesale"
const PER_PAGE = 200
const getBrandPageUrl = (brandName, page = 1) => `https://bellavka.by/catalog/${brandName}?per_page=${PER_PAGE}&page=${page}`
const TOKEN = "x-xsrf-token"
const ALL_BRANDS = "Все брэнды"
const ALL_ITEMS_SELECTOR = '.cat.title-h4'
const ALL_BRANDS_SELECTOR = '#page > div > div.main-content > div.header > div.navigation > div > div.second-menu > ul > li.main-menu__li.header__brands-li > div > div:nth-child(1) > div.links > a.all'

const getBrands = async () => {
  if (!Store.token) throw new Error("Невозможно запросить брэнды - отсутствует токен")
  const allBrands = [
    {
      name: ALL_BRANDS,
      value: ALL_BRANDS,
      id: 1,
      slug: {
        slug: "/",
      },
    },
  ];

  try {
    const response = await fetch("https://bellavka.by/info/brands", {
      headers: {
        [TOKEN]: Store.token,
        "cookie": cookiesParser(Store.cookie),
      },
      method: "POST",
    });
    const brands = await response.json()
    if (!brands) throw new Error("Не найдены брэнды")

    Object.keys(brands).forEach(letter => {
      const brandsByLetter = brands[letter]
      if (!brandsByLetter) return

      if (Array.isArray(brandsByLetter)) {
        return allBrands.push(...brands[letter])
      }

      allBrands.push(brands[letter])
    })

    return allBrands.map(brand => ({
      ...brand,
      name: brand.value,
    }))
  } catch (e) {
    console.log(e)
    throw new Error("Ошибка в запросе за брэндами")
  }
}

const getItemsInfoByIds = async (ids) => {
  try {
    return await Promise.all(ids.map(async (id) => {
      const form = getFormData([{ id }]);
      const res = await fetch("https://bellavka.by/catalog/quick-view", {
        headers: {
          "cookie": cookiesParser(Store.cookie),
          "x-xsrf-token": Store.token,
        },
        body: form,
        method: "POST",
      });
      return await res.json()
    }))
  } catch (e) {
    console.log(e)
    throw new Error("Ошибка в запросе за информацией товара (метод - getItemInfoByPages)")
  }
}

const requestCB = (request) => {
  const token = request.headers()[TOKEN]
  if (token && !Store.token) Store.token = token
}

const getPageCount = async (page) => {
  const { count, all } = await page.evaluate(({ ALL_ITEMS_SELECTOR, PER_PAGE }) => {
    //  ALL_ITEMS_SELECTOR was found element with inner like -> ' 763 товара'
    const all = +document.querySelector(ALL_ITEMS_SELECTOR).innerText.split(' ')[0]
    const count = all / PER_PAGE

    return {
      count: Math.ceil(count),
      all,
    }
  }, { ALL_ITEMS_SELECTOR, PER_PAGE })

  console.log("Найдено всего товаров:", all)
  console.log("Найдено страниц с товаром:", count)

  return new Array(count).fill(null).map((a, i) => i + 1);
}

const getItemInfoByPages = async (page, pageCounts, brandName) => {
  const result = []
  for await (const pageNumber of pageCounts) {
    console.log(`Парсим страницу ${pageNumber} (брэнд - ${brandName})`)
    const url = getBrandPageUrl(brandName, pageNumber)
    await page.goto(url);

    const itemsId = await page.evaluate(() =>
      window.dataLayer[1].ecommerce.impressions.map(({ id }) => id)
    )

    if (itemsId || itemsId.length) {
      const itemsInfo = await getItemsInfoByIds(itemsId)

      if (itemsInfo && itemsInfo.length) {
        result.push(...itemsInfo)
      }
    }
  }

  return result
}

const savingItemsInfo = async (items) => {
  console.log(`Спарсилось ${items.length}, начинаем сохранять`)
  // цикл по всем вещам в списке
  for await (const item of items) {
    const { id: numberId, photos } = item;
    const id = `${numberId}`

    const folderPath = path.join(path.resolve(), 'src', 'data');
    await mkdirp(path.join(folderPath, id));

    // скачать все картинки параллельно
    await Promise.all(photos.map(({ full }, i) =>
      full && download(full, id, `${id}_${i + 1}`))
    );

    await delay(1000);

    try {
      // сохраняем отдельно для каждой шмотки инфу
      await writeFileAsync(item, `${id}/${id}.json`);
    } catch (e) {
      console.log(e);
    }

    console.log(JSON.stringify(item, null, 4));
  }
}

const parser = async () => {
  console.time('scraping');
  console.log('scraping...');

  const browser = await getBrowser(true, true);
  Store.browser = browser

  const page = await getPage(browser, WHOLESALE_URL, true, requestCB);

  // клик по кнопке "Все брэнде" - для того что б выдрать токен
  if (!Store.token) await page.click(ALL_BRANDS_SELECTOR)
  Store.cookie = await getCookies(page);

  const brands = await getBrands();

  const { choice } = await selectMode('Выберите брэнд', brands);
  if (choice === ALL_BRANDS) {
    // todo Pavas - добавить режим для всех брэндов
    console.log('Вы выбрали режим:', ALL_BRANDS)
    console.log('На данный момент он в разработке!')
    console.timeEnd('scraping');
    await browser.close();

    return
  }

  /////////////////// парсинг по брэнду ////////////////
  const brandInfo = brands.find(({ name }) => name === choice)
  if (!brandInfo) throw new Error('Что то пошло не так, не сопоставился брэнд с вашим выбором')

  const { slug: { slug } } = brandInfo

  // идем на страницу брэнда
  await page.goto(getBrandPageUrl(slug));
  const pageCounts = await getPageCount(page);

  const allInfoAboutItems = await getItemInfoByPages(page, pageCounts, slug)

  await savingItemsInfo(allInfoAboutItems)

  console.timeEnd('scraping');
  await browser.close();
}

module.exports = {
  parser
};
