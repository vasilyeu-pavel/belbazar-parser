const url = require('url');
const path = require('path');
const mkdirp = require('mkdirp');

const { printHeader } = require('./src/utils/printHeader');
// file apis
const {
    writeFileAsync,
    download,
    remove
} = require('./src/utils/fileAPI');
// formData helpers
const { getFormData } = require('./src/utils/formData');
// requests
const { getList } = require('./src/utils/requests');
// filters
const { getFiltersData } = require('./src/utils/filters');

//  questions
const { selectMode } = require('./src/utils/questions');

// utils
const { delay, getRequestsCounts, parseUrl } = require('./src/utils/utils');

// loading
const {
    startLoading,
    stopLoading
} = require('./src/utils/loading');

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

const scrape = async (options = [], name) => {
    console.time('scraping');
    const result = [];
    const allCat = [];
    const allBrends = [];
    const seasons = [];
    const catWithBrends = {};

    console.log('Отчистка результатов прошлых запусков...');

    const folderPath = path.join(path.resolve(), 'src', 'data');

    // создаем пустую директорию
    // await mkdirp(folderPath);
    // await remove();

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
    const { domain, host } = parseUrl(url.parse(uri));
    const { parser } = require(`./src/extractors/${domain}/${domain}`);
    // вытягиваем куки с сайта
    const cookie = await parser(uri);

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

const run = async () => {
    printHeader();

    const { choice } = await selectMode();

    switch (choice) {
        case 'Выход!': return;
        case 'За все время': {
            return await scrape([], 'all');
        }
        case 'За неделю': {
            return await scrape(['7day'], 'week');
        }
        case 'За 48 часов': {
            return await scrape(['2day'], 'days');
        }
        case 'Закинуть на millmoda': {
            const { parser } = require(`./src/extractors/millmoda/millmoda.js`);

            return await parser();
        }
    }
};

run()
    .catch(e => console.log(e));
