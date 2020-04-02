const fetch = require('node-fetch');
const htmlToText = require('html-to-text');

const getHeigth = str =>
    +str.split(' ').filter(i => {
        // find '164'
        if (i.length === 3 && !isNaN(+i)) {
            return i
        }

        // find '164-178'
        if (i.length > 3 && i.includes('-') &&
            i.split('-').every((h) => !isNaN(+h))
        ) {
            return i;
        }
    })[0];

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
    gallery = '',
}) => {
    const { nazv, indexid: brendId, url, infotext } = brend;
    const height = getHeigth(search);

    const parsedText = htmlToText.fromString(text).replace(/\n/g,'');

    return {
        size_list,
        price_zakupka,
        text: parsedText,
        picture: `${host}${picture}`,
        pictures: gallery.split('"')
            .filter(p => p.includes('file'))
            .map(url => `https://belbazar24.by${url}`),
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
