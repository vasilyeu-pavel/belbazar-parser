const process = require('process');
const { remove } = require('./src/utils/fileAPI');
const { tgConfig } = require('./src/utils/telegramApi');
const { parser: millModaParser } = require('./src/extractors/millmoda/millmoda');
const { parser: belLavkaParser } = require('./src/extractors/belLavka');

const { printHeader } = require('./src/utils/printHeader');

//  questions
const { selectMode } = require('./src/utils/questions');

const run = async () => {
  printHeader();

  if (!tgConfig.token) {
    throw new Error("Не указан телеграмм token: /src/utils/telegramApi.js")
  }

  if (!tgConfig.chatId) {
    throw new Error("Не указан телеграмм chatId: /src/utils/telegramApi.js")
  }

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
    // no default
  }
};

run()
  .catch((e) => console.log(e))
  .finally(() => {
    process.kill(process.pid);
  });
