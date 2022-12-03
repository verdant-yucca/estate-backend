const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const {
  ERROR_TEXT_BED_REQUEST,
  ERROR_TEXT_NOT_FOUND_CARDS,
} = require('../utils/constants');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(ERROR_TEXT_BED_REQUEST.message));
      } else {
        next(err);
      }
    });
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        throw new NotFoundError(ERROR_TEXT_BED_REQUEST.message);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError(ERROR_TEXT_BED_REQUEST.message));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        throw new NotFoundError(ERROR_TEXT_NOT_FOUND_CARDS.message);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError(ERROR_TEXT_BED_REQUEST.message));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (card) {
        if (card.owner.equals(req.user._id)) {
          return Card.findByIdAndRemove(req.params.cardId)
            .then(() => {
              res.send({ data: card });
            });
        }
        throw new ForbiddenError('Нельзя удалять чужие карточки');
      } else {
        throw new NotFoundError(ERROR_TEXT_NOT_FOUND_CARDS.message);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(ERROR_TEXT_BED_REQUEST.message));
      } else {
        next(err);
      }
    });
};
