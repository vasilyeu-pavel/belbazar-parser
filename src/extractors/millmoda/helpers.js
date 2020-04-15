let fs = require('fs');
const fetch = require('node-fetch');
const HTMLParser = require('node-html-parser');

const { getFormData } = require('../../utils/formData');

const { brands, cats, sizes, sizesEU, heightsValue } = require('./data');

const createImg = async ({ filename, cookie, name = 'test', category = 89, brand = 191, add_date = '07.04.2020', sku = 1 }) => {
    const url = 'https://millmoda.ru/admin/catalog/ajax/item/0';

    const data = [
        {
            script: 'add',
        },
        {
            'name[ru]': name,
        },
        {
            category: category,
        },
        {
            brand: brand,
        },
        {
            add_date: add_date
        },
        {
            skin: 'item-new'
        },
        {
            sku: sku,
        },
        {
            'files[]': fs.createReadStream(filename)
        },
    ];

    const form = getFormData(data);

    const res = await fetch(url, {
        headers:{
            Cookie: cookie,
        },
        body:form,
        method: 'POST',
    });

    return await res.text();
};

const getCatId = cat => cats[cat] || null;

const getBrandId = brand => brands[brand] || null;

const getSize = (size_list) => {
    let str = '';

    size_list.forEach((s) => {
        const sizeId = sizes[s];
        const sizeEUId = sizesEU[s];

        if (sizeId) {
            str += `${decodeURI('field[3][]')}=${sizeId}&`;
        }

        if (sizeEUId) {
            str += `${decodeURI('field[16][]')}=${sizeEUId}&`;
        }
    });

    return str;
};

const getHeight = (heights) => {
    let str = '';

    if (!heights.includes('-')) {
        str += `${decodeURI('field[8][]')}=${heightsValue[heights]}&`
    } else {
        heights.split('-').map(h => {
            str += `${decodeURI('field[8][]')}=${heightsValue[h]}&`
        })
    }

    return str;
};

const checkIsItemIsCreated = async ({ cookie, itemInfo }) => {
    if (!itemInfo.articul) {
        throw new Error(`Отсутствует поле articul в ${itemInfo.indexid}`);
    }

    const url = `https://millmoda.ru/admin/catalog/list/item?filter%5Bsearch%5D=${itemInfo.articul}`;
    const response = await fetch(url,
        {
            headers: {
                Cookie: cookie,
                'content-type': 'application/x-www-form-urlencoded',
            },
        });

    const res = await response.text();

    const root = HTMLParser.parse(res);

    const table = root.querySelector('#items-table');

    if (!table) throw new Error(`table is null в ${itemInfo.indexid}`);

    const tbody = table.querySelector('tbody');

    if (!tbody) return null;

    const tr = tbody.querySelector('tr');

    if (!tr) return null;

    const idCell = tr.querySelector('td.center.small');

    if (!idCell) return null;

    const searchCell = tr.querySelectorAll('td')[2];

    if (!searchCell) return null;

    const createdId = idCell.text.length ? idCell.text.trim() : '';
    const searchField = searchCell.text.length ? searchCell.text.trim() : '';

    if (itemInfo.articul === searchField) {
        console.log('createdId', createdId);

        return createdId;
    }

    return null;
};

module.exports = {
    createImg,
    getSize,
    getHeight,
    getCatId,
    getBrandId,
    checkIsItemIsCreated,
};
