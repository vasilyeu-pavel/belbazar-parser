const { remove } = require('./src/utils/fileAPI');
const { parser: belBazarParser } = require(`./src/extractors/belbazar24/belbazar24.js`);
const { parser: millModaParser } = require(`./src/extractors/millmoda/millmoda.js`);

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
            return await belBazarParser([], null, true);
        }
        case 'Спарсить изменения за последние 2 дня': {
            return await belBazarParser([], 2);
        }
        case 'За все время': {
            return await belBazarParser([]);
        }
        case 'За неделю': {
            return await belBazarParser(['7day']);
        }
        case 'За 48 часов': {
            return await belBazarParser(['2day']);
        }
        case 'Закинуть на millmoda': {
            return await millModaParser({ withoutUpdatePrice: false });
        }
        case 'Закинуть на millmoda БЕЗ ИЗМЕНЕНИЯ ЦЕНЫ': {
            return await millModaParser({ withoutUpdatePrice: true });
        }
    }
};

run()
    .catch(e => console.log(e));
