const url = require('url');
const path = require('path');
const mkdirp = require('mkdirp');
const moment = require('moment');

const { getCookieFromPage, request, getBrandsList, selectBrand } = require('./helpers');

const { uri } = require('./data');

// utils
const { delay, getRequestsCounts, parseUrl } = require('../../utils/utils');

// file apis
const { writeFileAsync, download } = require('../../utils/fileAPI');

// questions
const { selectMode } = require('../../utils/questions');

const parser = async (options = [], dayAgo = null, byBrand = false) => {
    console.time('scraping');

    console.log('scraping...');

    await delay(1000);

    // подгружаем экстрактор
    const { host } = parseUrl(url.parse(uri));

    let requests = null;
    let cookie = null;

    let requestConfig = {};

    if (byBrand) {
        ////////////////////////////////////////////  brands   ///////////////////////////////////////////////////
        const brands = await getBrandsList(uri);

        if (!brands || !brands.length) {
            throw new Error('Не спарсились названия брэндов. Запустите заново.')
        }

        const { choice } = await selectMode('Выберите брэнд', brands);

        const choisedBrand = brands.find((b) => b.name === choice);

        console.log(`Парсим по брэнд ${JSON.stringify(choisedBrand)}`);

        if (!choisedBrand || !choisedBrand.id) {
            throw new Error('Не спарсились названия брэндов. Запустите заново.')
        }
        // вытягиваем куки с сайта
        cookie = await selectBrand(uri, choisedBrand.id);

        requestConfig = {
            cookie,
            host,
            options,
            [`1[${choisedBrand.id}]`]: choisedBrand.id,
        };

        // запрашиваем список
        const { countPages } = await request(requestConfig);
        requests = getRequestsCounts(countPages);

        console.log(`Найдено страниц: ${countPages}`);
    } else {
        ////////////////////////////////////////    all   //////////////////////////////////////////////////////
        // вытягиваем куки с сайта
        cookie = await getCookieFromPage(uri);
        // запрашиваем список
        requestConfig = { cookie, host, options };

        const { countPages } = await request(requestConfig);
        requests = getRequestsCounts(countPages);

        console.log(`Найдено страниц: ${countPages}`);
    }

    try {
        // цикл по всем страницам
        for await (const page of requests) {
            const { list } = await request({ ...requestConfig, page });

            const filteredList = list
                .filter(({ date_edit }) => {
                    if (!dayAgo) return true;

                    const dateAgo = moment().subtract(dayAgo, 'days');

                    const dateEdit = moment(date_edit);

                    return dateEdit >= dateAgo;
                })
                // пропускаем брэнд распродажа
                .filter(({ brend: { nazv = '' } }) => nazv.toUpperCase() !== 'РАСПРОДАЖА');

            // цикл по всем вещам в списке
            for await (const item of filteredList) {
                const { indexid: id, pictures } = item;

                const folderPath = path.join(path.resolve(), 'src', 'data');
                await mkdirp(path.join(folderPath, id));

                // скачать все картинки параллельно
                await Promise.all(pictures.map((picture, i) =>
                    download(picture, id, `${id}_${i + 1}`))
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

            console.log(`Was parsed page: ${page}`);
            console.log(`Was found ${list.length} item`);

            await delay(100);
        }
    } catch (e) {
        console.log(e);
    }

    console.timeEnd('scraping');
};

module.exports = {
    parser
};
