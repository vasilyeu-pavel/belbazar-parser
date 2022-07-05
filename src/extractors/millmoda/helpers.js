const fs = require('fs');
const fetch = require('node-fetch');
const HTMLParser = require('node-html-parser');

const { getFormData } = require('../../utils/formData');

const {
  brands,
  cats,
  sizes,
  sizesEU,
  heightsValue,
  fabrics,
  collections,
  seasons,
  kits,
  colors,
  styles,
} = require('./data');

const createImg = async ({
  filename, cookie, name = 'test', category = 89, brand = 191, add_date = '07.04.2020', sku = 1,
}) => {
  const url = 'https://millmoda.ru/admin/catalog/ajax/item/0';

  const data = [
    {
      script: 'add',
    },
    {
      'name[ru]': name,
    },
    {
      category,
    },
    {
      brand,
    },
    {
      add_date,
    },
    {
      skin: 'item-new',
    },
    {
      sku,
    },
    {
      'files[]': fs.createReadStream(filename),
    },
  ];

  const form = getFormData(data);

  try {
    const res = await fetch(url, {
      headers: {
        Cookie: cookie,
      },
      body: form,
      method: 'POST',
    });

    return await res.text();
  } catch (e) {
    console.log('error in createImg');
    console.log(e);
    throw new Error(e);
  }
};

const getCatId = cat => cats[cat] || null;

const getBrandId = brand => brands[brand] || null;

///

const getFabricId = fabric_list => {
  let str = '';

  fabric_list.forEach((fabric) => {
    const fabricId = fabrics[fabric];

    if (fabricId) {
      str += `${decodeURI('field[20][]')}=${fabricId}&`;
    }
  });

  return str;
};

const getCollectionId = collection_list => {
  let str = '';

  collection_list.forEach((collection) => {
    const collectionId = collections[collection];

    if (collectionId) {
      str += `${decodeURI('field[1][]')}=${collectionId}&`;
    }
  });

  return str;
};

const getSeasonId = season_list => {
  let str = '';

  season_list.forEach((season) => {
    const seasonId = seasons[season];

    if (seasonId) {
      str += `${decodeURI('field[18][]')}=${seasonId}&`;
    }
  });

  return str;
};

const getKitId = kit_list => {
  let str = '';

  kit_list.forEach((kit) => {
    const kitId = kits[kit];

    if (kitId) {
      str += `${decodeURI('field[10][]')}=${kitId}&`;
    }
  });

  return str;
};


const getColorId = color_list => {
  let str = '';

  color_list.forEach((color) => {
    const colorId = colors[color];

    if (colorId) {
      str += `${decodeURI('field[9][]')}=${colorId}&`;
    }
  });

  return str;
};

const getStyleId = style_list => {
  let str = '';

  style_list.forEach((style) => {
    const styleId = styles[style];

    if (styleId) {
      str += `${decodeURI('field[19][]')}=${styleId}&`;
    }
  });

  return str;
};

///

const getSize = (size_list) => {
  let str = '';

  size_list.forEach((s) => {
    const sizeId = sizes[s];
    const sizeEUId = sizesEU[s];

    if (sizeId) {
      str += `${decodeURI('field[3][]')}=${sizeId}&`;
    }

    if (sizeEUId) {
      str += `${decodeURI('field[16][]')}=${sizeEUId}&`;
    }
  });

  return str;
};

const getHeight = (heights) => {
  let str = '';

  if (!heights.includes('-')) {
    str += `${decodeURI('field[8][]')}=${heightsValue[heights]}&`;
  } else {
    heights.split('-').forEach((h) => {
      str += `${decodeURI('field[8][]')}=${heightsValue[h]}&`;
    });
  }

  return str;
};

const checkIsItemIsCreatedFromRequest = async ({ itemInfo: { indexid } }) => {
  const url = `https://millmoda.ru/export/json?sku=${indexid}`;

  const res = await fetch(url);

  const response = await res.json();

  console.log(`На милмоде не найдено товара по id ${indexid} белбазара`);

  if (!response && response.id) {
    return {
      createdId: null,
      images: [],
    };
  }

  console.log(`Инфа товара с милмоды по id ${indexid} белбазара`);
  console.log(response);

  return {
    ...response,
    createdId: response.id,
  };
};

const getOldPrice = async ({ id, sku, cookie }) => {
  const oldPriceSelector = 'price[2]';
  const url = `https://millmoda.ru/admin/catalog/edit/item/${id}?page=1&filter[search]=${sku}`;
  const res = await fetch(url, {
    headers: {
      Cookie: cookie,
    },
    method: 'GET',
  });
  const response = await res.text();

  const root = HTMLParser.parse(response);
  const input = root.querySelector(`[name="${oldPriceSelector}"]`);

  if (!input) return '';
  const value = input.getAttribute('value');
  console.log(`Старая цена - ${value}`);

  return value;
};

const removeImg = async ({ cookie, photoId }) => {
  const url = 'https://millmoda.ru/admin/catalog/ajax/item';

  const data = [
    {
      type: 'delphoto',
    },
    {
      photo: photoId,
    },
  ];

  const form = getFormData(data);

  try {
    await fetch(url, {
      headers: {
        Cookie: cookie,
      },
      body: form,
      method: 'POST',
    });

    console.log(`фотка ${photoId} удалена успешно`);
  } catch (e) {
    console.log('error in delete img');
    console.log(e);
    throw new Error(e);
  }
};

const getPrice = ({ price_zakupka, whole_price }) => price_zakupka || whole_price - 8;

module.exports = {
  createImg,
  getSize,
  getHeight,
  getCatId,
  getBrandId,
  checkIsItemIsCreatedFromRequest,
  removeImg,
  getOldPrice,
  getPrice,
  getFabricId,
  getCollectionId,
  getSeasonId,
  getKitId,
  getColorId,
  getStyleId,
};
