const inquirer = require('inquirer');

inquirer.registerPrompt('datetime', require('inquirer-datepicker-prompt'));

const choisesFromHomePage = [
  // {
  //     name: 'Спарсить по брэнду'
  // },
  // {
  //     name: 'Спарсить изменения за последние 2 дня'
  // },
  {
    name: 'Спарсить bellavka',
  },
  // {
  //     name: 'За все время'
  // },
  // {
  //     name: 'За неделю'
  // },
  // {
  //     name: 'За 48 часов'
  // },
  {
    name: 'Закинуть на millmoda',
  },
  {
    name: 'Закинуть на millmoda БЕЗ ИЗМЕНЕНИЯ ЦЕНЫ',
  },
  {
    name: 'Закинуть на millmoda БЕЗ ИЗМЕНЕНИЯ ЦЕН (старая/новая)',
  },
  {
    name: 'Отчистить папку data',
  },
  {
    name: 'Выход!',
  },
];

const getParsingDate = async () => {
  const questions = [
    {
      type: 'datetime',
      name: 'day',
      message: 'С какого дня будем парсить?',
      format: ['yyyy', '-', 'mm', '-', 'dd'],
      initial: Date.parse(new Date()),
      date: {
        min: '1/1/2017',
        max: '3/1/2017',
      },
    },
  ];

  return inquirer.prompt(questions);
};

const selectMode = async (message = 'Что делаем :) ?', choices = choisesFromHomePage) => {
  const questions = [
    {
      type: 'list',
      message,
      name: 'choice',
      choices,
    },
  ];

  return inquirer.prompt(questions);
};

module.exports = {
  selectMode, getParsingDate,
};
