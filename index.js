const { remove } = require('./src/utils/fileAPI');
const { parser: millModaParser } = require('./src/extractors/millmoda/millmoda.js');
const { parser: belLavkaParser } = require('./src/extractors/belLavka');

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
        case 'Спарсить bellavka': {
            return await belLavkaParser();
        }
        case 'Закинуть на millmoda': {
            return await millModaParser({
                withoutUpdatePrice: false,
                withoutUpdateOldPrice: false,
            });
        }
        case 'Закинуть на millmoda БЕЗ ИЗМЕНЕНИЯ ЦЕНЫ': {
            return await millModaParser({
                withoutUpdatePrice: true,
                withoutUpdateOldPrice: false,
            });
        }
        case 'Закинуть на millmoda БЕЗ ИЗМЕНЕНИЯ ЦЕН (старая/новая)': {
            return await millModaParser({
                withoutUpdatePrice: true,
                withoutUpdateOldPrice: true,
            });
        }
    }
};

run()
    .catch(e => console.log(e));
