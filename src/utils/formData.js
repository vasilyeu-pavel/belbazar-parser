const FormData = require('form-data');

const getFormData = (data, decode = false) => {
  const form = new FormData();

  data.forEach((item) => {
    for (const key in item) {
      if (!decode) {
        form.append(key, item[key]);
      } else {
        form.append(decodeURI(key), item[key]);
      }
    }
  });

  return form;
};

module.exports = {
  getFormData,
};
