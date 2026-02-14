const fs = require("fs");
const sharp = require("sharp");
const path = require("path");
const request = require("request");
const rimraf = require("rimraf");

const getAllParsedItemPath = () => {
  const pathFolder = "./src/data/";

  return fs
    .readdirSync(pathFolder)
    .filter((name) => fs.lstatSync(path.join(pathFolder, name)).isDirectory())
    .map((name) => ({
      id: name,
      path: path.join(pathFolder, name),
    }));
};

const remove = () =>
  new Promise((resolve) => {
    const folderPath = path.join(path.resolve(), "src", "data");

    rimraf(`${folderPath}/*`, () => {
      console.log("clear was done");
      resolve();
    });
  });

const download = async (uri, folderName, filename, options = {}) => {
  const { quality = 75, maxWidth = 1920, maxHeight = 1080 } = options;

  // Convert to .jpeg extension
  const finalFilename = filename.replace(/\.webp$/i, ".jpeg");
  const finalPath = path.join(
    path.resolve(),
    "src",
    "data",
    `${folderName}/${finalFilename}`,
  );

  return await new Promise((resolve, reject) => {
    const sharpInstance = sharp();

    request({
      uri,
      headers: {
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
        "Accept-Encoding": "gzip, deflate, br",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36",
      },
      gzip: true,
      encoding: null,
    })
      .on("error", reject)
      .pipe(sharpInstance)
      .resize(maxWidth, maxHeight, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({
        quality,
        mozjpeg: true,
        progressive: true,
        optimizeScans: true,
        chromaSubsampling: "4:2:0",
      })
      .pipe(fs.createWriteStream(finalPath))
      .on("finish", () => {
        const stats = fs.statSync(finalPath);
        const fileSizeInKB = stats.size / 1024;
        console.log(
          `JPEG saved: ${finalFilename} (${fileSizeInKB.toFixed(2)} KB, quality: ${quality})`,
        );
        resolve();
      })
      .on("error", reject);
  }).catch((error) => console.log(`Something happened: ${error}`));
};

const readFileAsync = (fileName) =>
  new Promise((resolve) => {
    const filepath = path.join(path.resolve(), "src", "data", fileName);

    if (!fs.existsSync(filepath)) {
      return resolve({});
    }

    fs.readFile(filepath, (err, data) => {
      if (err) throw err;
      resolve(JSON.parse(data));
    });
  });

const writeFile = (data, fileName) =>
  new Promise((resolve) => {
    const filepath = path.join(path.resolve(), fileName);

    fs.writeFile(filepath, JSON.stringify(data), (err) => {
      if (err) throw err;
      console.log(`The file ${fileName} has been saved!`);
      resolve();
    });
  });

const writeFileAsync = (data, fileName) =>
  new Promise((resolve) => {
    const filepath = path.join(path.resolve(), "src", "data", fileName);

    fs.writeFile(filepath, JSON.stringify(data), (err) => {
      if (err) throw err;
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
  writeFile,
};
