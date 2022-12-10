const telegramRouter = require('express').Router();

// TODO add validation

const {
  sendTlgMessage,
} = require('../controllers/transfer');

telegramRouter.post('/sendTlgMessage', sendTlgMessage);

module.exports = telegramRouter;
