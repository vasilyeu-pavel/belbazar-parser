const fs = require('fs');
const path = require('path');
const request = require('request');
const rimraf = require('rimraf');

const getAllParsedItemPath = () => {
    const pathFolder = './src/data/';

    return fs.readdirSync(pathFolder)
        .filter(name => fs.lstatSync(path.join(pathFolder, name)).isDirectory())
        .map((name) => ({
            id: name,
            path: path.join(pathFolder, name)
        }));
};

const remove = () => new Promise(resolve => {
    const folderPath = path.join(path.resolve(), 'src', 'data');

    rimraf(`${folderPath}/*`, () => {
        console.log('clear was done');
        resolve();
    });
});

const download = async (uri, folderName, filename) => {
    const filepath = path.join(path.resolve(), 'src', 'data', `${folderName}/${filename}.jpg`);

    let file = fs.createWriteStream(filepath);

    return await new Promise((resolve, reject) => {
        request({
            /* Here you should specify the exact link to the file you are trying to download */
            uri,
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'en-US,en;q=0.9,fr;q=0.8,ro;q=0.7,ru;q=0.6,la;q=0.5,pt;q=0.4,de;q=0.3',
                'Cache-Control': 'max-age=0',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36'
            },
            /* GZIP true for most of the websites now, disable it if you don't need it */
            gzip: true
        })
            .pipe(file)
            .on('finish', () => {
                console.log(`The file is finished downloading. ${uri}`);
                resolve();
            })
            .on('error', (error) => {
                reject(error);
            })
    })
        .catch(error => console.log(`Something happened: ${error}`));
};

const readFileAsync = (fileName) => new Promise(resolve => {
    const filepath = path.join(path.resolve(), 'src', 'data', fileName);

    if (!fs.existsSync(filepath)) {
        return resolve({});
    }

    fs.readFile(filepath, (err, data) => {
        if (err) throw err;
        resolve(JSON.parse(data));
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
    download,
    remove,
    getAllParsedItemPath,
};
