const selectors = {
  login: 'body > div > div.box-login > form > fieldset > div:nth-child(1) > span > input',
  pass: 'body > div > div.box-login > form > fieldset > div.form-group.form-actions > span > input',
  submit: 'body > div > div.box-login > form > fieldset > div:nth-child(3) > button',
};

// todo заполнить креды
const creds = {
  login: 'Pavlo_dostup',
  pass: 'Zhi35287898QWERTY',
};

const brands = {
  AGATTI: 337,
  'Aira Style': 20,
  AIRIN: 256,
  'Alani Collection': 191,
  'Algranda by Новелла Шарм': 76,
  AMORI: 338,
  Anastasia: 23,
  'Anastasiya Mak': 24,
  'Andrea Fashion': 303,
  'Andrea Style': 257,
  Anelli: 258,
  Angelina: 233,
  'Angelina & Сompany': 322,
  'Anna Majewska': 259,
  'Art Ribbon': 260,
  'AURA of the day': 327,
  'Avanti Erika': 176,
  AXXA: 29,
  AYZE: 241,
  Azzara: 133,
  'Barbara Geratti by Elma': 261,
  Bazalini: 163,
  'Beautiful&Free': 329,
  'Beauty Style': 203,
  BegiModa: 341,
  Belinga: 236,
  'Bonna Image': 167,
  Butеr: 220,
  Celentano: 262,
  COCOCO: 348,
  'Colors of PAPAYA': 189,
  Condra: 290,
  CORSA: 263,
  Danaida: 286,
  Deesses: 46,
  Deluizn: 190,
  Diamant: 287,
  'Dilana VIP': 226,
  DiLiaFashion: 315,
  Diva: 332,
  DIVINA: 155,
  Djerza: 92,
  DOGGI: 251,
  Edibor: 302,
  Elady: 193,
  ELGA: 146,
  ELLETTO: 44,
  'ELLETTO LIFE': 244,
  EMBER: 336,
  Emilia: 265,
  'Emilia Style': 325,
  EOLA: 139,
  'ERIKA STYLE': 176,
  Euromoda: 214,
  'Fantazia Mod': 111,
  Favorini: 301,
  Fawi: 334,
  FIORRI: 313,
  FloVia: 308,
  FORMAT: 243,
  'Fortuna. Шан-Жан': 234,
  'FOXY FOX': 252,
  'Galean Style': 91,
  GALEREJA: 181,
  Gizart: 205,
  'Golden Valley': 268,
  GRATTO: 317,
  INPOINT: 333,
  IVA: 250,
  Jersey: 93,
  JeRusi: 52,
  JRSy: 326,
  Juanta: 113,
  'Juliet Style': 246,
  Jurimex: 194,
  Kaloris: 288,
  'Karina deLux': 170,
  'KIARA Collection': 305,
  Klever: 255,
  'Kod:127': 267,
  'Koketka i K': 289,
  LadisLine: 150,
  'Lady Line': 54,
  'Lady Secret': 55,
  Lakbi: 291,
  LaKona: 57,
  LARICI: 324,
  'Lea Lea': 269,
  LeNata: 59,
  LIBERTY: 270,
  Liliana: 292,
  LIMO: 323,
  'Liona Style': 168,
  Lissana: 62,
  LM: 314,
  Lokka: 229,
  Lyushe: 100,
  MALI: 271,
  Marko: 249,
  MAX: 320,
  'Mia-Moda': 102,
  'Michel chic': 304,
  'MILA ROSH': 272,
  Milana: 103,
  'Mira Fashion': 65,
  Mirolia: 137,
  'Moda Versal': 293,
  Modema: 330,
  Motif: 273,
  MUA: 345,
  Mubliz: 152,
  'N.O.W.': 339,
  Nadin: 128,
  'Needle Ревертекс': 219,
  Ninele: 74,
  'NiV NiV': 274,
  'NiV NiV fashion': 275,
  'Noche mio': 75,
  NORMAL: 346,
  'Nova Line': 19,
  Olegran: 135,
  Ollsy: 309,
  PiRS: 228,
  Prestige: 78,
  Pretty: 151,
  Prio: 295,
  'PUR PUR': 311,
  Rami: 347,
  Rishelie: 218,
  Rivoli: 276,
  'Romanovich Style': 204,
  Runella: 143,
  S_ette: 344,
  Samnari: 307,
  SandyNa: 278,
  Slaviaelit: 279,
  SODA: 217,
  SoLei: 231,
  'Solomeya Lux': 165,
  SOVITA: 280,
  SVETLANOVA: 328,
  Swallow: 281,
  'T&A': 201,
  'T&N': 342,
  TAiER: 312,
  'Taita plus': 282,
  'Teffi Style': 283,
  'Tellura-L': 298,
  Temper: 239,
  Tensi: 300,
  TEZA: 240,
  'TrikoTex Stil': 299,
  TVIN: 131,
  Urs: 114,
  Vasalale: 310,
  Verita: 140,
  Vesnaletto: 285,
  'VIA-Mod': 230,
  Vilena: 340,
  'Viola Style': 235,
  'Vittoria Queen': 184,
  Vladini: 319,
  VOLNA: 318,
  'Your size': 306,
  'Арита-Denissa': 264,
  Асолия: 89,
  БагираАнТа: 284,
  'Ивелта плюс': 94,
  'Ксения Стиль': 95,
  'Линия Л': 248,
  'Магия моды': 101,
  'Мишель стиль': 199,
  'Мода Юрс': 222,
  Ника: 335,
  'Ольга Стиль': 179,
  Орхидея: 108,
  Панда: 294,
  'Сч@стье': 296,
  'Таир-Гранд': 297,
  'Твой имидж': 182,
};

const cats = {
  Одежда: 57,
  'Платья и сарафаны': 84,
  Костюмы: 18,
  'Брючные костюмы': 91,
  'Юбочные костюмы': 103,
  Комплекты: 17,
  'Комплекты с блузой': 104,
  'Комплекты с платьем': 105,
  'Комплекты с верхней одеждой': 106,
  'Комплекты брючные': 107,
  'Комплекты юбочные': 108,
  'Верхняя одежда': 80,
  Куртки: 5,
  Пальто: 27,
  Плащи: 37,
  'Пончо и накидки': 41,
  Жилеты: 109,
  'Шубы и дублёнки': 70,
  'Джемперы и кардиганы': 110,
  Водолазки: 87,
  Джемперы: 42,
  Кардиганы: 49,
  Свитеры: 65,
  Кофты: 6,
  'Жакеты и жилеты': 83,
  Жакеты: 36,
  Болеро: 61,
  'Блузы и рубашки': 79,
  Блузы: 7,
  Боди: 66,
  Рубашки: 51,
  Туники: 40,
  'Топы и майки': 111,
  Майки: 55,
  Топы: 67,
  Поло: 112,
  'Брюки и шорты': 81,
  Брюки: 28,
  'Капри и бриджи': 48,
  Леггинсы: 53,
  Шорты: 54,
  Юбки: 43,
  Комбинезоны: 45,
  'Спортивная одежда': 113,
  'Брюки и леггинсы': 114,
  'Толстовки и олимпийки': 74,
  'Майки и топы': 115,
  'Шорты и велосипедки': 116,
  'Свадебная одежда': 117,
  'Одежда для беременных': 118,
  'Домашняя одежда': 119,
  Пижамы: 100,
  Халаты: 50,
  'Ночные сорочки': 101,
  'Блузы и топы': 120,
  'Носки, чулки и колготки': 122,
  Колготки: 123,
  'Носки и гольфы': 124,
  Чулки: 125,
  'Купальники и пляжная одежда': 95,
  Парео: 126,
  Лифы: 99,
  Плавки: 98,
  Слитные: 96,
  Раздельные: 97,
  'Нижнее бельё': 128,
  Бюстгальтер: 130,
  Трусы: 129,
  Аксессуары: 131,
  Комбинация: 63,
  'Головные уборы': 73,
  'Шарфы и платки': 72,
  'Перчатки и варежки': 132,
  Другое: 76,
  'Сумки и рюкзаки': 59,
  'Кошельки и косметички': 133,
  'Ремни и пояса': 90,
  Украшения: 89,
  'Защитные маски': 134,
};

const sizes = {
  38: '31',
  40: '25',
  42: '7',
  44: '8',
  46: '9',
  48: '10',
  50: '11',
  52: '12',
  54: '13',
  56: '14',
  58: '15',
  60: '16',
  62: '17',
  64: '18',
  66: '19',
  68: '20',
  70: '21',
  72: '22',
  74: '23',
  76: '32',
  78: '217',
  80: '218',
  82: '219',
  84: '220',
  универсальный: '222',
  36: '221',
};

const sizesEU = {
  '2XL': '201',
  '2XL/L': '210',
  '2XL/M': '208',
  '3XL': '202',
  '3XL/XL': '211',
  '4XL': '203',
  '4XL/2XL': '212',
  '4XL/3XL': '213',
  '5XL': '204',
  '5XL/3XL': '214',
  L: '199',
  'L/M': '206',
  'L/S': '205',
  M: '198',
  S: '197',
  XL: '200',
  'XL/L': '209',
  102: '225',
  106: '226',
  110: '227',
  '40/C': '228',
  '44/E': '229',
  '46/F': '230',
  '48/G': '231',
  '70A': '232',
  '70B': '233',
  '70C': '234',
  '70D': '235',
  '75A': '236',
  '75B': '237',
  '75C': '238',
  '75C/L': '239',
  '75C/M': '240',
  '75D': '241',
  '75D/L': '242',
  '75D/M': '243',
  '75E/L': '244',
  '75E/M': '245',
  '75F/L': '246',
  '75F/M': '247',
  '80A': '248',
  '80B': '249',
  '80C': '250',
  '80C/L': '251',
  '80D': '252',
  '80D/L': '253',
  '80D/XL': '254',
  '80E/L': '255',
  '80E/XL': '256',
  '80F/XL': '257',
  '80H/XL': '258',
  '85A': '259',
  '85B': '260',
  '85C': '261',
  '85E/XL': '262',
  '85F/2XL': '263',
  '85F/XL': '264',
  90: '265',
  '90A': '266',
  '90C': '267',
  94: '268',
  98: '269',
  'D/38': '270',
  'D/40': '271',
  'E/38': '272',
  'E/40': '273',
  'E/42': '274',
  'F/40': '275',
  'F/42': '276',
  'F/44': '277',
  'G/42': '278',
  'G/44': '279',
  'G/46': '280',
  'H/44': '281',
  'H/46': '282',
  'H/48': '283',
  'без размера': '284',
  'XL/M': '207',
};

const heightsValue = {
  116: '151',
  122: '156',
  128: '157',
  134: '158',
  140: '152',
  146: '153',
  152: '154',
  158: '171',
  164: '26',
  170: '27',
  176: '128',
  182: '126',
  188: '127',
  194: '223',
  200: '224',
};

module.exports = {
  selectors,
  creds,
  brands,
  cats,
  sizes,
  sizesEU,
  heightsValue,
};
