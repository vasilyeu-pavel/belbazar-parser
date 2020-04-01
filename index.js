const url = require('url');
const { printHeader } = require('./src/utils/printHeader');
// file apis
const { writeFileAsync } = require('./src/utils/fileAPI');
// formData helpers
const { getFormData } = require('./src/utils/formData');
// requests
const { getList } = require('./src/utils/requests');
// filters
const { getFiltersData } = require('./src/utils/filters');

//  questions
const { getQuestions, selectMode, questionsForDownloadSimpleMatch } = require('./src/utils/questions');

// utils
const { delay, getRequestsCounts, parseUrl } = require('./src/utils/utils');

// loading
const {
    startLoading,
    stopLoading
} = require('./src/utils/loading');

const uri = 'https://belbazar24.by/catalog/';

const request = ({ cookie, host, page = 1, options }) => {
    const filters = getFiltersData({
        page,
        '2day': options.includes('2day'),
        '7day': options.includes('7day')
    });

    const formData = getFormData(filters);

    return getList({ body: formData, cookie, host });
};

const scrape = async (options = [], name) => {
    const result = [];

    console.log('cleaning...');

    await writeFileAsync([], `${name}.json`);

    console.log('scraping...');

    await delay(1000);

    const i = startLoading();

    const { domain, host } = parseUrl(url.parse(uri));

    const { parser } = require(`./src/extractors/${domain}`);
    const cookie = await parser(uri);

    const { countPages } = await request({ cookie, host, options });
    const requests = getRequestsCounts(countPages);

    console.log(countPages);

    stopLoading(i);

    for await (const page of requests) {
        if (page < 10) {
            const {list} = await request({ cookie, host, page, options });

            console.log(`Was parsed page: ${page}`);
            console.log(`Was found ${list.length} item`);

            result.push(...list);

            await delay(1000);
        }
    }

    await writeFileAsync(result, `${name}.json`);
};

const main = async () => {
    printHeader();

    const { choice } = await selectMode();

    switch (choice) {
        case 'За все время': {
            return await scrape([], 'all');
        }
        case 'За неделю': {
            return await scrape(['7day'], 'week');
        }
        case 'За 48 часов': {
            return await scrape(['2day'], 'days');
        }
        case 'Выход!': return;
    }
};

main()
    .catch(e => console.log(e));
