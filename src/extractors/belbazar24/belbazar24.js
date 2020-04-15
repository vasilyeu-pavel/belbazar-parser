const url = require('url');
const path = require('path');
const mkdirp = require('mkdirp');

const { getBrowser, cookiesParser, getPage, getCookies } = require('../../utils/page');

// utils
const { delay, getRequestsCounts, parseUrl } = require('../../utils/utils');

// loading
const {
    startLoading,
    stopLoading
} = require('../../utils/loading');

// file apis
const {
    writeFileAsync,
    download
} = require('../../utils/fileAPI');
// formData helpers
const { getFormData } = require('../../utils/formData');
// requests
const { getList } = require('../../utils/requests');
// filters
const { getFiltersData } = require('../../utils/filters');

const selectros = {
    sort: '#sort_form > select',
    size: '#view_form > select',
};

const getCookieFromPage = async (url, targetCookieName = 'PHPSESSID') => {
    const browser = await getBrowser();
    const page = await getPage(browser, url);

    await page.select(selectros.sort, 'articul asc');

    await page.waitFor(2000);

    await page.select(selectros.size, '201');

    const cookie = await getCookies(page);

    await browser.close();

    return cookiesParser(cookie, targetCookieName);
};

const uri = 'https://belbazar24.by/catalog/';

const request = ({ cookie, host, page = 1, options }) => {
    const filters = getFiltersData({
        page,
        '2day': options.includes('2day'),
        '7day': options.includes('7day')
    });

    const formData = getFormData(filters);

    return getList({ body: formData, cookie, host });
};

const parser = async (options = [], name) => {
    console.time('scraping');
    const result = [];
    const allCat = [];
    const allBrends = [];
    const seasons = [];
    const catWithBrends = {};

    console.log('Отчистка результатов прошлых запусков...');

    const folderPath = path.join(path.resolve(), 'src', 'data');

    // создаем пустые файлы
    await writeFileAsync(result, `${name}.json`);
    await writeFileAsync(catWithBrends, 'catWithBrends.json');
    await writeFileAsync(allBrends, 'allBrends.json');
    await writeFileAsync(allCat, 'allCat.json');
    await writeFileAsync(seasons, 'seasons.json');

    console.log('scraping...');

    await delay(1000);

    const i = startLoading();

    // подгружаем экстрактор
    const { host } = parseUrl(url.parse(uri));
    // вытягиваем куки с сайта
    const cookie = await getCookieFromPage(uri);

    // запрашиваем список
    const { countPages } = await request({ cookie, host, options });
    const requests = getRequestsCounts(countPages);

    console.log(`Найдено страниц: ${countPages}`);

    stopLoading(i);

    try {
        // цикл по всем страницам
        for await (const page of requests) {
            const { list } = await request({ cookie, host, page, options });

            // цикл по всем вещам в списке
            for await (const item of list) {
                const { indexid: id, pictures, brend: { nazv = '' } } = item;

                // пропускаем брэнд распродажа
                if (
                    nazv.toUpperCase() !== 'РАСПРОДАЖА'
                // !nazv.includes('Elpaiz') ||
                // !nazv.includes('LaVela') ||
                // !nazv.includes('Леди Стиль Классик')

                ) {

                    await mkdirp(path.join(folderPath, id));

                    // скачать все картинки
                    await Promise.all(pictures.map((picture, i) =>
                        download(picture, id, `${id}_${i + 1}`))
                    );

                    await delay(500);

                    // скачать все картинки
                    // for await (const picture of pictures) {
                    //
                    //     await download(picture, id, `${id}_${i}`);
                    //
                    //     await delay(1000);
                    // }

                    // сохраняем отдельно для каждой шмотки инфу
                    await writeFileAsync(item, `${id}/${id}.json`);

                    // сохраняем все категории
                    if (!allCat.includes(item.cat_nazv)) {
                        allCat.push(item.cat_nazv)
                    }

                    // сохраняем все сезоны
                    if (!seasons.includes(item.season)) {
                        seasons.push(item.season)
                    }

                    // сохраняем все брэнды
                    if (!allBrends.includes(item.brend.nazv)) {
                        allBrends.push(item.brend.nazv)
                    }

                    // сохраняем все брэнды дл категорий
                    if (!catWithBrends[item.cat_nazv]) {
                        catWithBrends[item.cat_nazv] = [];
                    }
                    catWithBrends[item.cat_nazv].push(item.brend.nazv);

                    // сохраняем собирательные файлы
                    await writeFileAsync(catWithBrends, 'catWithBrends.json');
                    await writeFileAsync(allBrends, 'allBrends.json');
                    await writeFileAsync(allCat, 'allCat.json');
                    await writeFileAsync(seasons, 'seasons.json');

                    console.log(item);
                }
            }

            console.log(`Was parsed page: ${page}`);
            console.log(`Was found ${list.length} item`);

            result.push(...list);

            await delay(100);
        }
    } catch (e) {
        console.log(e);
    } finally {
        await writeFileAsync(result, `${name}.json`);
    }

    console.timeEnd('scraping');
};

module.exports = {
    parser
};
