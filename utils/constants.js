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
