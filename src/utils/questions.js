const inquirer = require('inquirer');

const selectMode = async () => {
    const questions = [
        {
            type: 'list',
            message: 'Выбрать период :) ?',
            name: 'choice',
            choices: [
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
