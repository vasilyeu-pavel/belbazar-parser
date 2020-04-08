let fs = require('fs');
const fetch = require('node-fetch');
const { getFormData } = require('../../utils/formData');

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

const getRazmeri = (size_list) => {
    // размеры
    // ключ - размер
    // value - id для сохранения в базе
    const razmeri = {
        38: "31",
        40: "25",
        42: "7",
        44: "8",
        46: "9",
        48: "10",
        50: "11",
        52: "12",
        54: "13",
        56: "14",
        58: "15",
        60: "16",
        62: "17",
        64: "18",
        66: "19",
        68: "20",
        70: "21",
        72: "22",
        74: "23",
        76: "32",
    };

    let str = '';

    size_list.forEach((s) => {
        const razmerId = razmeri[s];
        str += `${decodeURI('field[3][]')}=${razmerId}&`
    });

    return str;
};

const getHeight = (heights) => {
    const rost = {
        116: "151",
        122: "156",
        128: "157",
        134: "158",
        140: "152",
        146: "153",
        152: "154",
        158: "171",
        164: "26",
        170: "27",
        176: "128",
        182: "126",
        188: "127"
    };

    let str = '';

    if (!heights.includes('-')) {
        str += `${decodeURI('field[8][]')}=${rost[heights]}&`
    } else {
        heights.split('-').map(h => {
            str += `${decodeURI('field[8][]')}=${rost[h]}&`
        })
    }

    return str;
};

module.exports = {
    createImg,
    getRazmeri,
    getHeight
};
