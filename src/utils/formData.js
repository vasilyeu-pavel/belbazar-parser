const FormData = require('form-data');

const getFormData = (data) => {
    const form = new FormData();

    data.forEach(item => {
        for (const key in item) {
            form.append(key, item[key]);
        }
    });

    return form;
};

module.exports = {
    getFormData
};
