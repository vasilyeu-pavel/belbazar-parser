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

const getCatId = (cat) => ({
        "Комплекты": 17,
        "Платья и сарафаны": 84,
        "Костюмы брючные": 91,
        "Блузы и рубашки": 7,
        "Брюки": 81,
        "Костюмы юбочные": 18,
        "Верхняя одежда": 80,
        "Жакеты": 36,
        "Кардиганы": 49,
        "Спортивная одежда": 46,
        "Жилеты": 26,
        "Джемперы": 42,
        "Комбинезоны": 45,
        "Юбки": 43,
        "Топы": 67,
        "Туники": 40,
        "Шорты": 54,
        "Аксессуары": 82,
        "Каталог": null,
        "Одежда для дома": 50,
        "Купальники": 95
    }[cat] || null);

const getBrandId = (brand) => ({

    }[brand] || null);

const getSize = (size_list) => {
    // размеры
    // ключ - размер
    // value - id для сохранения в базе
    const sizes = {
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
        const sizeId = sizes[s];
        str += `${decodeURI('field[3][]')}=${sizeId}&`
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
    getSize,
    getHeight,
    getCatId,
};
