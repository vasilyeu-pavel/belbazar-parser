const moment = require('moment');
const fetch = require('node-fetch');
const fs = require('fs');

const { getAllParsedItemPath, readFileAsync } = require('../../utils/fileAPI');

const { creds, selectors } = require('./data');

const { getBrowser, cookiesParser, getPage, getCookies, auth } = require('../../utils/page');

const { delay } = require('../../utils/utils');

const {
    createImg,
    getSize,
    getHeight,
    getCatId,
    getBrandId,
    checkIsItemIsCreated,
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

        if (
            Object.keys(itemInfo).length &&
            itemInfo.brend &&
            getCatId(itemInfo.cat_nazv) &&
            getBrandId(itemInfo.brend.nazv || '')
        ) {
            // получить все пути к картинкам в товаре
            const allImgPath = fs.readdirSync(path)
                .filter((file) => file.includes('.jpg'))
                .map(file => `${path}/${file}`);

            console.log('<===========Информация о товаре===============>');
            console.log(itemInfo);
            console.log('<=============================================>');

            try {
                const createdId = await checkIsItemIsCreated({ cookie: parsedCookie, itemInfo });

                if (!createdId) {
                    // создать
                    console.log(`Создаем ${itemInfo.indexid}`);
                    const html = await createThing({
                        cookie: parsedCookie,
                        itemInfo,
                        allImgPath,
                        isAddMode: true,
                    });

                    if (html.includes('Вход в систему')) {
                        console.log(`Не отправлен запрос на создание ${id}`);
                        console.log('Умер токен, нужно перезапустить скрипт');
                    } else {
                        console.log('<===========Статус===============>');
                        console.log(`Товар успешно создан ${id}`);
                        console.log('<================================>');
                    }
                } else {
                    // обновить
                    console.log(`Обновляем ${createdId} (${itemInfo.indexid})`);
                    await createThing({
                        cookie: parsedCookie,
                        itemInfo,
                        allImgPath,
                        isAddMode: false,
                        createdId
                    });

                    console.log('<===========Статус===============>');
                    console.log(`Товар успешно обновлен ${createdId}`);
                    console.log('<================================>');
                }

            } catch (e) {
              console.log(e)
            }
        }
    }

    await delay(3000);

    await browser.close();
};

const createThing = async ({
   cookie,
   itemInfo,
   allImgPath,
   isParallel = true,
   isAddMode = false,
   createdId = null
}) => {
    const { price_zakupka, text, sostav, size_list, height, indexid, cat_nazv, brend, articul } = itemInfo;

    const dateNow = moment().format('DD.MM.YYYY');

    const imgs = [];

    // фотки создавать только при создании
    if (isAddMode) {
        // залить все картинки
        if (isParallel) {
            const createdImgs = await Promise.all(allImgPath.map((filename) =>
                createImg({
                    cookie,
                    filename,
                    add_date: dateNow,
                    sku: indexid,
                })));

            imgs.push(...createdImgs);

        } else {
            for (const filename of allImgPath) {
                const img = await createImg({
                    cookie,
                    filename,
                    add_date: dateNow,
                    sku: indexid,
                });

                imgs.push(img);

                console.log('photo_response:', img);

                await delay(1000);
            }
        }
    }

    let photoIds = '';

    if (!imgs) return '';

    // прикрепить id картинки к шмоту
    imgs.forEach(img => {
        const { files } = JSON.parse(img);

        Object.keys(files).forEach(fileId => {
            if (fileId && fileId.length) {
                photoIds += `${decodeURI('photo_id[]')}=${fileId}&`
            }
        });
    });

    const addUrl = 'https://millmoda.ru/admin/catalog/add/item?page=1';
    const editUrl = `https://millmoda.ru/admin/catalog/edit/item/${createdId}?page=1`;

    const url = isAddMode ? addUrl : editUrl;

    // сохранить шмот
    const response = await fetch(url,
        {
            headers:{
                Cookie: cookie,
                'content-type': 'application/x-www-form-urlencoded',
            },
            body:`
            script=${isAddMode ? 'add' : 'edit'}&
            name%5Bru%5D=${articul || ''}&
            sku=${indexid}&
            category=${getCatId(cat_nazv)}& 
            brand=${getBrandId(brend.nazv)}&
            short_desc%5Bru%5D%5B1%5D=${sostav}&
            desc%5Bru%5D%5B1%5D=${text}&
            price%5B1%5D=${price_zakupka}&
            price%5B2%5D=&
            ${getSize(size_list)}
            ${getHeight(`${height}`)}
            ${photoIds}
            avail=1&
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
