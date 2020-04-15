let fs = require('fs');
const fetch = require('node-fetch');
const HTMLParser = require('node-html-parser');

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
    'Нова Лайн': 19,
    'Aira Style': 20,
    Anastasia: 23,
    'Anastasia Mak': 24,
    'АХХА':	29,
    'Elletto': 44,
    'DEESSES': 46,
    'JeRusi': 52,
    'Ладис Лайн': 54,
    'Lady Secret': 55,
    Лакона:	57,
    LeNata:	59,
    Лиссана: 62,
    'Mira Fashion':	65,
    Нинель: 74,
    'Ноче Мио':	75,
    'Новелла Шарм':	76,
    Prestige: 78,
    Асолия:	89,
    'Галеан Стиль':	91,
    'Ивелта Плюс': 94,
    'Ксения Стиль':	95,
    'ЛЮШЕ':	100,
    'Магия Моды':	101,
    'МиА Мода':	102,
    'Орхидея Люкс':	108,
    'Фантазия Мод':	111,
    Юанта: 113,
    Юрс:	114,
    'Надин-Н': 128,
    Аззара:	133,
    Олегран:	135,
    Mirolia:	137,
    'Эола Дизайн':	139,
    Runella:	143,
    PRETTY:	151,
    'Мублиз':	152,
    'Дивина':	155,
    Solomeya:	165,
    'Bonna Image': 167,
    'Карина Делюкс': 170,
    'Avanti (Erika Style)':	176,
    'Ольга Стиль':	179,
    'ТВОЙ ИМИДЖ':	182,
    'VITTORIA QUEEN':	184,
    Алани:	191,
    ELady:	193,
    'Мишель Стиль':	199,
    'Мишель Шик':	199,
    'Beauty Style':	203,
    Романович:	204,
    GIZART:	205,
    EUROMODA:	214,
    Ришелье: 	218,
    BUTER:	220,
    AGATTI:	221,
    'Мода Юрс':	222,
    'Dilana Vip':	226,
    PiRS:	228,
    LOKKA:	229,
    Angelina:	233,
    'Виола Стиль':	235,
    Temper:	239,
    TEZA:	240,
    Айзе:	241,
    'Медея и К':	242,
    FORMAT:	243,
    'Juliet style':	246,
    'Линия Л':	248,
    MARKO:	249,
    DOGGI:	251,
    AIRIN:	256,
    'Andrea Style':	257,
    Anelli:	258,
    'Anna Majewska':	259,
    ArtRibbon:	260,
    'Barbara Geratti':	261,
    Celentano:	262,
    'Colors of Papaya':	189,
    CORSA:	263,
    'Denissa Fashion (Arita)':	264,
    Emilia:	265,
    Faufilure:	266,
    'Golden Valley':	268,
    Jurimex:	194,
    'KOD 127':	267,
    'Lea Lea':	269,
    LIBERTY:	270,
    MALi:	271,
    'Mila Rosh':	272,
    MOTIF:	273,
    'Niv Niv':	274,
    'Niv Niv FASHION':	275,
    Rivoli:	276,
    'S MALICH':	277,
    SandyNa:	278,
    SLAVIA:	279,
    SOVITA:	280,
    Swallow:	281,
    'Taita Plus':	282,
    'TEFFI Style':	283,
    'Багира АнТа':	284,
    Весналетто:	285,
    Данаида:	286,
    Диамант:	287,
    Калорис:	288,
    'Кокетка и К':	289,
    Кондра:	290,
    Лакби:	291,
    Лилиана:	292,
    'Мода Версаль':	293,
    ПАНДА:	294,
    Прио:	295,
    'Сч@стье':	296,
    'Таир Гранд':	297,
    'Теллура-Л':	298,
    'Трикотекс Стиль':	299,
    Тэнси:	300,
    Фаворини:	301,
    Эдибор:	302,
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
