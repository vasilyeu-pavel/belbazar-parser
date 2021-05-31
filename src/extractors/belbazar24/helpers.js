const { selectors } = require('./data');
// browsers utils
const { getBrowser, cookiesParser, getPage, getCookies } = require('../../utils/page');
// formData helpers
const { getFormData } = require('../../utils/formData');
// requests
const { getList } = require('../../utils/requests');
// filters
const { getFiltersData } = require('../../utils/filters');

const getCookieFromPage = async (url, targetCookieName = 'PHPSESSID') => {
    const browser = await getBrowser(true, true);
    const page = await getPage(browser, url);

    await page.select(selectors.sort, 'articul asc');

    await page.waitFor(2000);

    await page.select(selectors.size, '201');

    const cookie = await getCookies(page);

    await browser.close();

    return cookiesParser(cookie, targetCookieName);
};

const getBrandsList = async (url) => {
    const browser = await getBrowser(true, false);
    const page = await getPage(browser, url);

    const brands = await page.evaluate(() =>
        [...document
            .querySelector('#fbox_brand')
            .querySelectorAll('.filtr_item')
        ]
            .map(col => ({
                id: col.querySelector('input').value || '',
                name: col.innerText.trim() || '',
            }))
    );

    await browser.close();

    return brands;
};

const selectBrand = async (url, id) => {
    const browser = await getBrowser(false, false);
    const page = await getPage(browser, url);

    await page.evaluate(({ brandId }) => {
        document
            .getElementById(`f_brand_${brandId}`).click()
    }, { brandId: id });

    await page.waitFor(3000);

    const cookie = await getCookies(page);

    await browser.close();

    return cookiesParser(cookie, 'PHPSESSID');
};

const request = ({ cookie, host, page = 1, options, ...other }) => {
    const filters = getFiltersData({
        page,
        '2day': options.includes('2day'),
        '7day': options.includes('7day'),
        catFilter: other,
    });

    const formData = getFormData(filters);

    // todo pavas поменять на парсинг
    return getList({ body: formData, cookie, host });
};

module.exports = {
    getCookieFromPage,
    request,
    getBrandsList,
    selectBrand,
};
