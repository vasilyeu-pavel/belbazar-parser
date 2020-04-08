const selectors = {
    login: 'body > div > div.box-login > form > fieldset > div:nth-child(1) > span > input',
    pass: 'body > div > div.box-login > form > fieldset > div.form-group.form-actions > span > input',
    submit: 'body > div > div.box-login > form > fieldset > div:nth-child(3) > button'
};

// todo заполнить креды
const creds = {
    login: '',
    pass: '',
};

module.exports = {
    selectors,
    creds,
};
