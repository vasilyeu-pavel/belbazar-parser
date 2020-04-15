const { remove } = require('./src/utils/fileAPI');

const { printHeader } = require('./src/utils/printHeader');

//  questions
const { selectMode } = require('./src/utils/questions');

const run = async () => {
    printHeader();

    const { choice } = await selectMode();

    switch (choice) {
        case 'Выход!': return;
        case 'Отчистить папку data': {
            return await remove();
        }
        case 'За все время': {
            const { parser } = require(`./src/extractors/belbazar24/belbazar24.js`);

            return await parser([], 'all');
        }
        case 'За неделю': {
            const { parser } = require(`./src/extractors/belbazar24/belbazar24.js`);

            return await parser(['7day'], 'week');
        }
        case 'За 48 часов': {
            const { parser } = require(`./src/extractors/belbazar24/belbazar24.js`);


            return await parser(['2day'], 'days');
        }
        case 'Закинуть на millmoda': {
            const { parser } = require(`./src/extractors/millmoda/millmoda.js`);

            return await parser();
        }
    }
};

run()
    .catch(e => console.log(e));