const http = require('request');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const { baseUrlTelegramAPI, ERROR_BED_REQUEST, ERROR_NOT_FOUND } = require('../utils/constants');

const { telegramToken, telegramChatID } = process.env;

module.exports.sendTlgMessage = (req, res, next) => {
  const http = require('request');
  const NotFoundError = require('../errors/NotFoundError');
  const BadRequestError = require('../errors/BadRequestError');
  const {baseUrlTelegramAPI, ERROR_BED_REQUEST, ERROR_NOT_FOUND} = require('../utils/constants');

  const {telegramToken, telegramChatID} = process.env;

  module.exports.sendTlgMessage = (req, res, next) => {
    const {subject, name, phoneNumber, message} = req.body;
    const msg = [
      "<b>Тема: </b>" + subject,
      "<b>Имя: </b>" + name,
      "<b>Телефон: </b>" + phoneNumber,
      "<b>Сообщение: </b>" + message,
    ];
    let messagetlg = "";
    msg.forEach(msg => {
      messagetlg += msg + '\n';
    })

    messagetlg = encodeURI(messagetlg);

    http.post(`${baseUrlTelegramAPI}${telegramToken}/sendMessage?chat_id=${telegramChatID}&parse_mode=html&text=${messagetlg}`, function (error, response, body) {
      if(response.statusCode===200){
        res.status(200).json({status: 'ok', message: 'Успешно отправлено!'});
      } else if(response.statusCode===ERROR_BED_REQUEST.code){
        res.status(ERROR_BED_REQUEST.code).json({status: 'error', message: ERROR_BED_REQUEST.messageTelegram});
      } else if(response.statusCode===ERROR_NOT_FOUND.code){
        res.status(ERROR_NOT_FOUND.code).json({status: 'error', message: ERROR_NOT_FOUND.messageTelegram});
      } else next(err)
    });
  };
};
