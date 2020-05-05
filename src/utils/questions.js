const inquirer = require('inquirer');

const choisesFromHomePage = [
    {
        name: 'Спарсить по брэнду'
    },
    {
        name: 'Спарсить изменения за последние 2 дня'
    },
    {
        name: 'За все время'
    },
    {
        name: 'За неделю'
    },
    {
        name: 'За 48 часов'
    },
    {
        name: 'Закинуть на millmoda'
    },
    {
        name: 'Отчистить папку data'
    },
    {
        name: 'Выход!'
    }
];

const selectMode = async (message = 'Что делаем :) ?', choices = choisesFromHomePage) => {
    const questions = [
        {
            type: 'list',
            message,
            name: 'choice',
            choices
        }
    ];

    return inquirer.prompt(questions);
};

module.exports = {
    selectMode,
};
