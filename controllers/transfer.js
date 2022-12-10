const http = require('request');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const { baseUrlTelegramAPI, ERROR_BED_REQUEST, ERROR_NOT_FOUND } = require('../utils/constants');

const { telegramToken, telegramChatID } = process.env;

module.exports.sendTlgMessage = (req, res, next) => {
  const message = encodeURI(req.body.message);
  http.post(`${baseUrlTelegramAPI}${telegramToken}/sendMessage?chat_id=${telegramChatID}&parse_mode=html&text=${message}`)
    .then(() => {
      res.send({
        status: 'Ok',
      });
    })
    .catch((err) => {
      if (err.code === ERROR_BED_REQUEST.code) {
        next(new BadRequestError(ERROR_BED_REQUEST.messageTelegram));
      }
      if (err.code === ERROR_NOT_FOUND.code) {
        next(new NotFoundError(ERROR_NOT_FOUND.messageTelegram));
      }
      next(err);
    });
};
