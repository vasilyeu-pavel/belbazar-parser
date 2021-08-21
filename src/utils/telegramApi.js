const TelegramBot = require('node-telegram-bot-api');

const config = {
  token: '',
  chatId: '',
};

const bot = new TelegramBot(config.token, { polling: true });

const createMessage = ({ id, message }) => {
  return `*[${id} - Ошибка milmoda]*:
  ${message}
 `;
};

const sendTelegramMessage = async (error) => {
  const messages = createMessage(error);

  return await bot.sendMessage(config.chatId, messages, { parse_mode: "markdown" });
};

module.exports = { sendTelegramMessage };
