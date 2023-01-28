const telegramRouter = require('express').Router();
const auth = require("../middlewares/auth");

// TODO add validation

const {
  sendTlgMessage,
} = require('../controllers/transfer');

telegramRouter.use(auth);
telegramRouter.post('/sendTlgMessage', sendTlgMessage);

module.exports = telegramRouter;
