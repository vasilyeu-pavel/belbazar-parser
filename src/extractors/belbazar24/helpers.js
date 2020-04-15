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
    const browser = await getBrowser();
    const page = await getPage(browser, url);

    await page.select(selectors.sort, 'articul asc');

    await page.waitFor(2000);

    await page.select(selectors.size, '201');

    const cookie = await getCookies(page);

    await browser.close();

    return cookiesParser(cookie, targetCookieName);
};

const request = ({ cookie, host, page = 1, options }) => {
    const filters = getFiltersData({
        page,
        '2day': options.includes('2day'),
        '7day': options.includes('7day')
    });

    const formData = getFormData(filters);

    return getList({ body: formData, cookie, host });
};

module.exports = {
    getCookieFromPage,
    request,
};
