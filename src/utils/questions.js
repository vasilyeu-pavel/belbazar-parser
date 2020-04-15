const inquirer = require('inquirer');

const selectMode = async () => {
    const questions = [
        {
            type: 'list',
            message: 'Что делаем :) ?',
            name: 'choice',
            choices: [
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
            ]
        }
    ];

    return inquirer.prompt(questions);
};

module.exports = {
    selectMode
};
