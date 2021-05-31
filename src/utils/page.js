const puppeteer = require('puppeteer');

const blockedResourceTypes = [
    'image',
    'media',
    'font',
    'texttrack',
    'object',
    'beacon',
    'csp_report',
    'imageset',
    'stylesheet'
];

const skippedResources = [
    'quantserve',
    'adzerk',
    'doubleclick',
    'adition',
    'exelator',
    'sharethrough',

    'cdn.api.twitter',
    'google-analytics',
    'googletagmanager',
    'google',
    'fontawesome',
    'facebook',
    'analytics',
    '.png',
    'optimizely',

    'clicktale',
    'mixpanel',
    'zedo',
    'clicksor',
    'tiqcdn',
    'jquery'
];

const getCookies = async (page) => await page.cookies();

const auth = async (page, selectors, creds) => {
    await page.waitForSelector(selectors.login);

    const loginInput = await page.$(selectors.login);
    await loginInput.type(creds.login);

    const passInput = await page.$(selectors.pass);
    await passInput.type(creds.pass);

    const btn = await page.$(selectors.submit);
    await btn.click();
};

const getPage = async (browser, url, isLoadScript = true, requestCB) => {
    const page = await browser.newPage();

    await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36'
    );

    try {
        if (isLoadScript) {
            await page.setRequestInterception(true);

            page.on('request', (request) => {
                requestCB && requestCB(request)
                if (
                    blockedResourceTypes.indexOf(request.resourceType()) !== -1
                    || skippedResources.some((resource) => request.url().includes(resource))
                ) {
                    request.abort();
                }
                else {
                    request.continue();
                }
            });

            page.on('dialog', async (dialog) => {
                await dialog.dismiss();
            });
        }

        await page.setDefaultNavigationTimeout(0);

        await page.goto(url, {
            waitNetworkIdle: true,
            timeout: 0,
            waitUntil: 'load'
        });

        return page;
    }
    catch (e) {
        throw new Error(`Ошибка открытия страницы, ${e.message}`);
    }
};

const cookiesParser = (cookies, targetName) => {
    const arrFiltered = targetName ? cookies.filter((el) => el.name === targetName) : cookies;

    let str = '';
    for (let i = 0; i < arrFiltered.length; i++) {
        const elCookies = `${arrFiltered[i].name}=${arrFiltered[i].value}; `;
        str += elCookies;
    }

    return str.trim();
};

const getBrowser = (hide = true, devtools) => puppeteer.launch({
    args: [
        '--no-sandbox',
        '--window-size=1920,1170','--window-position=0,0',
    ],
    defaultViewport:null,
    devtools: devtools,
    headless: hide // -------> for show browser
});

module.exports = {
    getBrowser,
    cookiesParser,
    getPage,
    getCookies,
    auth,
};
