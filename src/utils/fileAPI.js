const fs = require('fs');
const path = require('path');

const readFileAsync = (fileName) => new Promise(resolve => {
    fs.readFile(fileName, (err, data) => {
        if (err) throw err;
        resolve(data);
    });
});

const writeFileAsync = (data, fileName) => new Promise(resolve => {
    const filepath = path.join(path.resolve(), 'src', 'data', fileName);

    fs.writeFile(filepath, JSON.stringify(data), (err) => {
        if (err) throw err;
        console.log(`Was saved ${data.length} items`);
        console.log(`The file ${fileName} has been saved!`);
        resolve();
    });
});

module.exports = {
    readFileAsync,
    writeFileAsync,
};
