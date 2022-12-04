const { celebrate, Joi } = require('celebrate');
const { vldEstate } = require('../utils/constants');

module.exports.createUserValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string()
      .regex(
        /^((http|https):\/\/)?(www\.)?([a-zа-я0-9]{1}[a-zа-я0-9-\\]*\.?)*\.{1}[a-zа-я0-9-]{2,8}(\w-\.~:\/?#\[\]@!$&'\(\)*\+,;=)?/i,
      ),
  }),
});

module.exports.loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.updateUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

module.exports.updateAvatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required()
      .regex(
        /^((http|https):\/\/)?(www\.)?([a-zа-я0-9]{1}[a-zа-я0-9-\\]*\.?)*\.{1}[a-zа-я0-9-]{2,8}(\w-\.~:\/?#\[\]@!$&'\(\)*\+,;=)?/i,
      ),
  }),
});

module.exports.userIdValidation = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24).hex(),
  }),
});
module.exports.estateIdValidation = celebrate({
  params: Joi.object().keys({
    estateId: Joi.string().required().length(24).hex(),
  }),
});

module.exports.createEstateValidation = celebrate({
  body: Joi.object().keys({
    title: Joi.string().required().min(vldEstate.minLenTitle).max(vldEstate.maxLenTitle),
    price: Joi.number().required(),
    address: Joi.string().required(),
    image: Joi.string().required()
      .regex(
        /^((http|https):\/\/)?(www\.)?([a-zа-я0-9]{1}[a-zа-я0-9-\\]*\.?)*\.{1}[a-zа-я0-9-]{2,8}(\w-\.~:\/?#\[\]@!$&'\(\)*\+,;=)?/i,
      ),
    target: Joi.boolean(),
  }),
});

module.exports.cardIdValidate = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(),
  }),
});
