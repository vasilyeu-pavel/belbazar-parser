const url = require('url');
const path = require('path');
const mkdirp = require('mkdirp');

const { printHeader } = require('./src/utils/printHeader');
// file apis
const {
    writeFileAsync,
    download,
    remove
} = require('./src/utils/fileAPI');
// formData helpers
const { getFormData } = require('./src/utils/formData');
// requests
const { getList } = require('./src/utils/requests');
// filters
const { getFiltersData } = require('./src/utils/filters');

//  questions
const { selectMode } = require('./src/utils/questions');

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

    try {
        for await (const page of requests) {
            if (page === 1) {
                const { list } = await request({cookie, host, page, options});

                for await (const item of list) {
                    const folderPath = path.join(path.resolve(), 'src', 'data', item.indexid);
                    await mkdirp(folderPath);

                    await download(`https://${item.picture}`, item.indexid);

                    await writeFileAsync(item, `${item.indexid}/${item.indexid}.json`);

                    console.log(item);
                }

                console.log(`Was parsed page: ${page}`);
                console.log(`Was found ${list.length} item`);

                result.push(...list);

                await delay(100);
            }
        }
    } catch (e) {
        console.log(e);
    }

    await writeFileAsync(result, `${name}.json`);
};

const main = async () => {
    printHeader();

    const folderPath = path.join(path.resolve(), 'src', 'data');

    await mkdirp(folderPath);

    await remove();

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
