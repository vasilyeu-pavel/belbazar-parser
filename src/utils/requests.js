const fetch = require('node-fetch');
const htmlToText = require('html-to-text');

const getHeightAndSeason = str =>
    str.split(' ').map((i, j) => {
        // find '164'
        if (i.length === 3 && !isNaN(+i)) {
            return ({
                height: i || 0,
                season: str.split(' ')[j + 1] || '',
            })
        }

        // find '164-178'
        if (i.length > 3 && i.includes('-') &&
            i.split('-').every((h) => !isNaN(+h))
        ) {
            return ({
                height: i || 0,
                season: str.split(' ')[j + 1] || '',
            })
        }
    }).filter(Boolean);

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
    nazv: itemNazv = '',
    date_edit,
}) => {
    const { nazv, indexid: brendId, url, infotext } = brend;
    const options = getHeightAndSeason(search);

    const [{ height, season }] = options && options.length ? options : [{ season: '', height: '' }];

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
        itemNazv,
        season,
        date_edit,
        brend: {
            nazv, brendId, url, infotext
        }
    };
});

const fetcher = async ({ cookie, url, body }) => {
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            cookie
        },
        body
    });

   return await res.json();
};

const getList = async ({ body, cookie, host }) => {
    const url = 'https://belbazar24.by/ajax.php';

    const { list, count_pages } = await fetcher({ url, body, cookie });

    return {
        list: filterByNeedFields(list, host),
        countPages: count_pages,
    };
};

module.exports = {
    getList,
    fetcher,
};
