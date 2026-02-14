const fetch = require("node-fetch");
const path = require("path");
const mkdirp = require("mkdirp");

const { selectMode, getParsingDate } = require("../../utils/questions");

// utils
const { delay } = require("../../utils/utils");

// file apis
const { writeFileAsync, download } = require("../../utils/fileAPI");

// data for filter
const { notAvailableBrands } = require("./data");

const Store = {
  parsingDate: null,
};

const ALL_BRANDS = "Все брэнды";

function getFileExtension(url) {
  return url.split(".").pop();
}

const filterByBrands = ({ value: brand }) =>
  !notAvailableBrands.includes(brand);

const compareDate = (updated_date) =>
  new Date(Store.parsingDate) <= new Date(updated_date);

const getBrands = async () => {
  try {
    const response = await fetch(
      "https://rest-api.bellavka.com/api/v1/brands",
      {
        headers: {
          accept: "application/json",
          "x-currency": "usd",
          "x-domain": "com",
          "x-origin": "bellavka",
          "x-shop": "bellavka",
        },
        method: "GET",
        referrer: "https://bellavka.com/",
      },
    );

    const { data: brands, message } = await response.json();

    if (message !== "success")
      throw new Error("Ошибка запроса за списком брендов");

    if (!brands || !brands.length) throw new Error("Не найдены брэнды");

    const filteredBrands = brands.map((brand) => ({
      ...brand,
      slug: {
        slug: brand.slug,
      },
    }));

    filteredBrands.push({
      name: ALL_BRANDS,
      value: ALL_BRANDS,
      id: 1,
      slug: {
        slug: "/",
      },
    });

    return filteredBrands.map((brand) => ({
      ...brand,
      name: brand.value,
    }));
  } catch (e) {
    console.log(e);
    throw new Error("Ошибка в запросе за брэндами");
  }
};

const getItemInfo = async (id) => {
  try {
    const response = await fetch(
      `https://rest-api.bellavka.com/api/v1/products/${id}?include=media,other_colors,recommended,in_favorite,counters,outlet`,
      {
        headers: {
          accept: "application/json",
          "x-currency": "usd",
          "x-domain": "com",
          "x-origin": "bellavka",
          "x-shop": "bellavka",
        },
        method: "GET",
        referrer: "https://bellavka.com/",
      },
    );

    const { data, message } = await response.json();

    if (message !== "success") {
      throw new Error(`Ошибка запроса за инфой о товаре: ${id}`);
    }

    return data;
  } catch (e) {
    console.log(e);
  }
};

const prepareDataForMilModa = async (items) => {
  const results = [];

  for (const { id } of items) {
    console.log(`Запрашиваем инфу за товаром: ${id}`);

    const item = await getItemInfo(id);
    const { brand, category, options, description, name, prices, fabricText } =
      item;

    const { height, size } = options || {};

    results.push({
      ...item,
      indexid: id,
      articul: name,
      brend: {
        nazv: brand.value,
      },
      cat_nazv: category.value,
      height:
        height?.items && height.items.length > 0
          ? height.items
              .map((item) => item.value)
              .join("-")
              .trim()
          : "164",
      size_list: size?.items ? size.items.map((item) => item.value) : [],
      price_zakupka: prices.currentUsd || prices.current,
      sostav: fabricText,
      text: description,
    });

    const ms = 1000;
    console.log(`Пауза ${ms}ms перед след запросом`);
    await delay(ms);
  }

  return results;
};

const savingItemsInfo = async (items) => {
  console.log(`Спарсилось ${items.length}, начинаем сохранять`);

  // цикл по всем вещам в списке
  for await (const item of items) {
    const { id: numberId, photos } = item;
    const id = `${numberId}`;

    const folderPath = path.join(path.resolve(), "src", "data");
    await mkdirp(path.join(folderPath, id));

    // скачать все картинки параллельно
    await Promise.all(
      photos.map((src, i) =>
        download(
          src.replace("/size/", "/3760x-/"),
          id,
          `${id}_${i + 1}.${getFileExtension(src)}`,
        ),
      ),
    );

    await delay(1000);

    try {
      // сохраняем отдельно для каждой шмотки инфу
      await writeFileAsync(item, `${id}/${id}.json`);
    } catch (e) {
      console.log(e);
    }

    console.log(`Скачали ${numberId}`);
  }
};

const parsingByBrand = async (brandInfo) => {
  if (!brandInfo) {
    throw new Error(
      "Что то пошло не так, не сопоставился брэнд с вашим выбором",
    );
  }

  const {
    slug: { slug },
    value,
  } = brandInfo;

  console.log(`Начинаем парсить брэнд: ${value}`);

  let page = 1;
  const allItems = [];

  const getItemsInfo = async () => {
    try {
      const response = await fetch(
        `https://rest-api.bellavka.com/api/v1/products?sort=default&include=media,other_colors,recommended,in_favorite,counters,outlet,description&params=${slug}&page=${page}`,
        {
          headers: {
            accept: "application/json",
            "x-currency": "usd",
            "x-domain": "com",
            "x-origin": "bellavka",
            "x-shop": "bellavka",
          },
          method: "GET",
          referrer: "https://bellavka.com/",
        },
      );

      const { data, message, meta } = await response.json();

      if (message !== "success") {
        throw new Error(`Ошибка парсинга бренда:${brandInfo.value}`);
      }

      // Add current page items to the collection
      allItems.push(...data);

      console.log(
        `Page ${page}: Added ${data.length} items. Total: ${allItems.length}`,
      );

      const { current_page, last_page } = meta;

      // Check if there are more pages
      if (current_page < last_page) {
        page++;
        await getItemsInfo(); // Recursive call for next page
      } else {
        console.log(`Completed! Total items fetched: ${allItems.length}`);
        console.log(
          `Filtering parsed items by date (date ${Store.parsingDate}), was ${allItems.length}`,
        );

        // All items are now in allItems array
        return allItems;
      }
    } catch (error) {
      console.error("Error fetching items:", error);
      throw error;
    }
  };

  // Start fetching
  await getItemsInfo();

  const filteredItems = allItems.filter(({ date }) => compareDate(date.create));

  console.log(`стало ${filteredItems.length}`);

  const preparedItems = await prepareDataForMilModa(filteredItems);

  await savingItemsInfo(preparedItems);
};

const parser = async () => {
  console.time("scraping");
  console.log("scraping...");

  const allBrands = await getBrands();

  const brands = allBrands.filter(filterByBrands);

  const { day } = await getParsingDate();

  Store.parsingDate = day;

  const { choice } = await selectMode("Выберите брэнд", brands);

  if (choice === ALL_BRANDS) {
    console.log("Вы выбрали режим:", ALL_BRANDS);

    for await (const brandInfo of brands) {
      if (brandInfo.value !== ALL_BRANDS) {
        await parsingByBrand(brandInfo);
      }
    }

    console.timeEnd("scraping");

    return;
  }

  /// //////////////// парсинг по брэнду ////////////////
  const brandInfo = brands.find(({ name }) => name === choice);

  await parsingByBrand(brandInfo);

  console.timeEnd("scraping");
};

module.exports = {
  parser,
};
