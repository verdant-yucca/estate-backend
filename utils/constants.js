const path = require("path");
// const {compressImages} = require("./imageUtils");
const {kladrToken, kladrKey} = process.env;
exports.ERROR_BED_REQUEST = {
  code: 400,
  message: 'Переданы некорректные данные',
  messageTelegram: 'Чат не существует или переданы некорректные данные',
};
exports.ERROR_NOT_FOUND = {
  code: 404,
  messageUser: 'Данный пользователь не существует',
  messageEstate: 'Объект недвижимости не существует',
  messageTelegram: 'Токен бота прострочен или не существует',
  messageContent: 'Данного контента не существует'
};
exports.ERROR_INTERNAL_SERVER = {
  code: 500,
  message: 'Сервер не отвечает',
};
exports.secretKey = 'salt-salt-salt';

exports.baseUrlTelegramAPI = 'https://api.telegram.org/bot';

exports.vldEstate = {
  minLenTitle: 3,
  maxLenTitle: 50,

};
exports.url = "https://cleaner.dadata.ru/api/v1/clean/address";
//let query = "мск сухонска 11/-89";

exports.options = (address) => {return {
  method: "POST",
  mode: "cors",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Token " + kladrToken,
    "X-Secret": kladrKey
  },
  body: JSON.stringify([address])}
}

exports.imgList = ['.png','.jpg','.jpeg','.gif'];

exports.baseUrlImageEstate = path.join('public','images','estates', 'uncompressed');
exports.baseUrlImageContent = path.join('public','images','contents', 'uncompressed');
exports.dirCompressedImagesEstate = 'public/images/estates/compressed/';
exports.dirCompressedImagesContent = 'public/images/contents/compressed/';
exports.buildUrlImageEstate = path.join('public','images','estates', 'compressed');
exports.buildUrlImageContent = path.join('public','images','contents', 'compressed');