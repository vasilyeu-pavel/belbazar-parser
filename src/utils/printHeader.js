const chalk = require('chalk');
const figlet = require('figlet');

const printHeader = () => {
    console.clear();

    console.log(
        chalk.green(
            figlet.textSync('P A R S E R S', {
                font: 'Standard',
                horizontalLayout: 'default',
                verticalLayout: 'default'
            })
        )
    );
};

module.exports = {
    printHeader
};
