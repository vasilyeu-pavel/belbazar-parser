const { getBrowser, cookiesParser, getPage, getCookies } = require('../../utils/page');

const selectros = {
    sort: '#sort_form > select',
    size: '#view_form > select',
};

const parser = async (url, targetCookieName = 'PHPSESSID') => {
    const browser = await getBrowser();
    const page = await getPage(browser, url);

    await page.select(selectros.sort, 'articul asc');

    await page.waitFor(2000);

    await page.select(selectros.size, '201');

    // await page.evaluate(() => {
    //     document.querySelector('.filtr_tab_link').click()
    // }, {});
    //
    // await page.evaluate(() => {
    //     document.querySelector('#sort_form > div:nth-child(6) > a').click()
    // }, {});

    const cookie = await getCookies(page);

    await browser.close();

    return cookiesParser(cookie, targetCookieName);
};

module.exports = {
    parser
};
