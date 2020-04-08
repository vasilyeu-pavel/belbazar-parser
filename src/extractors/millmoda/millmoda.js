const moment = require('moment');
const fetch = require('node-fetch');

const fs = require('fs');

const { getAllParsedItemPath, readFileAsync } = require('../../utils/fileAPI');

const { creds, selectors } = require('./data');

const { getBrowser, cookiesParser, getPage, getCookies, auth } = require('../../utils/page');

const { delay } = require('../../utils/utils');

const {
    createImg,
    getRazmeri,
    getHeight
} = require('./helpers');

const parser = async () => {
    const url = 'https://millmoda.ru/admin/login';

    const browser = await getBrowser();
    const page = await getPage(browser, url);

    await auth(page, selectors, creds);

    const cookie = await getCookies(page);

    const parsedCookie = cookiesParser(cookie);

    console.log(parsedCookie);

    const allParsedItems = getAllParsedItemPath();

    // получаем пути ко всем спаршеным товарам
    for await (const { id, path } of allParsedItems) {
        // получаем json файл в папке с товаром
        const itemInfo = await readFileAsync(`${id}/${id}.json`);
        if (Object.keys(itemInfo).length) {
            // получить все пути к картинкам в товаре
            const allImgPath = fs.readdirSync(path)
                .filter((file) => file.includes('.jpg'))
                .map(file => `${path}/${file}`);

            try {
                const html = await createThing({ cookie: parsedCookie, itemInfo, allImgPath });

                if (html.includes('Вход в систему')) {
                    console.log(`Не отправлен запрос на создание ${id}`);
                } else {
                    console.log(`Отправле запрос на создание ${id}`)
                }
            } catch (e) {
                console.log(e);
            }

        }
    }

    await delay(3000);

    await browser.close();
};

// todo разобраться категориями и брэндами
const createThing = async ({ cookie, itemInfo, allImgPath }) => {
    const { price_zakupka, text, sostav, size_list, height, indexid, itemNazv } = itemInfo;

    const url = 'https://millmoda.ru/admin/catalog/add/item?page=1';

    const id = Date.now();

    const dateNow = moment().format('DD.MM.YYYY');

    // залить все картинки
    const imgs = await Promise.all(allImgPath.map((filename) =>
        createImg({ cookie, filename, add_date: dateNow }))
    );

    let photoIds = '';

    // прикрепить id картинки к шмоту
    imgs.forEach(img => {
        const { files } = JSON.parse(img);

        Object.keys(files).forEach(fileId => {
            if (fileId && fileId.length) {
                photoIds += `${decodeURI('photo_id[]')}=${fileId}&`
            }
        });

        console.log('imgResponse:', files);
    });

    // сохранить шмот
    const response = await fetch(url,
        {
            headers:{
                Cookie: cookie,
                'content-type': 'application/x-www-form-urlencoded',
            },

            body:`
            script=add&
            name%5Bru%5D=${itemNazv}&
            sku=${indexid}&
            category=89&
            brand=191&
            short_desc%5Bru%5D%5B1%5D=${sostav}&
            desc%5Bru%5D%5B1%5D=${text}&
            price%5B1%5D=${price_zakupka}&
            price%5B2%5D=&
            ${getRazmeri(size_list)}
            ${getHeight(`${height}`)}
            ${photoIds}
            skin=item-new&
            add_date=${dateNow}&
            files%5B%5D=&
            seo_title%5Bru%5D=&
            seo_desc%5Bru%5D=&
            seo_keys%5Bru%5D=`
                .replace(/\n/g, ''),
            method: 'POST',
        });

    return await response.text();
};

module.exports = {
    parser
};
