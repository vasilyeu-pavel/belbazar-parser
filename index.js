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
        case 'Спарсить по брэнду': {
            const { parser } = require(`./src/extractors/belbazar24/belbazar24.js`);


            return await parser([], null, true);
        }
        case 'Спарсить изменения за последние 2 дня': {
            const { parser } = require(`./src/extractors/belbazar24/belbazar24.js`);

            return await parser([], 2);
        }
        case 'За все время': {
            const { parser } = require(`./src/extractors/belbazar24/belbazar24.js`);

            return await parser([]);
        }
        case 'За неделю': {
            const { parser } = require(`./src/extractors/belbazar24/belbazar24.js`);

            return await parser(['7day']);
        }
        case 'За 48 часов': {
            const { parser } = require(`./src/extractors/belbazar24/belbazar24.js`);


            return await parser(['2day']);
        }
        case 'Закинуть на millmoda': {
            const { parser } = require(`./src/extractors/millmoda/millmoda.js`);

            return await parser();
        }
    }
};

run()
    .catch(e => console.log(e));
