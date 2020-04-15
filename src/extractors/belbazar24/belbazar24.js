const url = require('url');
const path = require('path');
const mkdirp = require('mkdirp');

const { getCookieFromPage, request } = require('./helpers');

const { uri } = require('./data');

// utils
const { delay, getRequestsCounts, parseUrl } = require('../../utils/utils');

// loading
const { startLoading, stopLoading } = require('../../utils/loading');

// file apis
const { writeFileAsync, download } = require('../../utils/fileAPI');

const parser = async (options = []) => {
    console.time('scraping');

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
                if (nazv.toUpperCase() !== 'РАСПРОДАЖА') {

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

                    console.log(item);
                }
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
