const fetch = require('node-fetch');
const htmlToText = require('html-to-text');

const getHeigth = str =>
    +str.split(' ').filter(i => i.length === 3 && !isNaN(+i))[0];

const filterByNeedFields = (list, host) => list.map(({
    size_list = [],
    price_zakupka = null,
    text = null,
    picture = null,
    articul = null,
    indexid = null,
    sostav = null,
    brend = {},
    cat_nazv = null,
    search = '',
}) => {
    const { nazv, indexid: brendId, url, infotext } = brend;
    const height = getHeigth(search);

    const parsedText = htmlToText.fromString(text).replace(/\n/g,'');

    return {
        size_list,
        price_zakupka,
        text: parsedText,
        picture: `${host}${picture}`,
        articul,
        indexid,
        sostav,
        cat_nazv,
        height,
        brend: {
            nazv, brendId, url, infotext
        }
    };
});

const getList = async ({ body, cookie, host }) => {
    const url = 'https://belbazar24.by/ajax.php';

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            cookie
        },
        body
    });
    const { list, count_pages } = await res.json();

    return {
        list: filterByNeedFields(list, host),
        countPages: count_pages,
    };
};

module.exports = {
    getList,
};
