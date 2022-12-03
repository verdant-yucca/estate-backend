const cardsRouter = require('express').Router();
const { createCardValidation, cardIdValidate } = require('../middlewares/validatons');

const {
  createCard,
  getCards,
  likeCard,
  dislikeCard,
  deleteCard,
} = require('../controllers/cards');

cardsRouter.post('/cards', createCardValidation, createCard);
cardsRouter.get('/cards', getCards);
cardsRouter.delete('/cards/:cardId', cardIdValidate, deleteCard);
cardsRouter.put('/cards/:cardId/likes', cardIdValidate, likeCard);
cardsRouter.delete('/cards/:cardId/likes', cardIdValidate, dislikeCard);

module.exports = cardsRouter;
