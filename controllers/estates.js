const Estate = require('../models/estate');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const {
  ERROR_TEXT_BED_REQUEST,
  ERROR_TEXT_NOT_FOUND_USERS,
} = require('../utils/constants');

// title, price, address, image, target

module.exports.createEstate = (req, res, next) => {
  const {
    title, price, address, image, target,
  } = req.body;
  Estate.create({
    title, price, address, image, target,
  })
    .then((estate) => res.send({
      estate: {
        title: estate.title,
        price: estate.price,
        image: estate.image,
        address: estate.address,
        _id: estate._id,
      },
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(ERROR_TEXT_BED_REQUEST.message));
      } else {
        next(err);
      }
    });
};

module.exports.getEstates = (req, res, next) => {
  Estate.find({})
    .then((estates) => res.send(estates))
    .catch(next);
};

module.exports.getEstate = (req, res, next) => {
  Estate.findById(req.params.estateId)
    .then((estate) => {
      if (estate) {
        res.send(estate);
      } else {
        throw new NotFoundError(ERROR_TEXT_NOT_FOUND_USERS.message);
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

module.exports.updateEstate = (req, res, next) => {
  const {
    title, price, address, image, target,
  } = req.body;
  Estate.findByIdAndUpdate(
    req.estate._id,
    {
      title, price, address, image, target,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((estate) => {
      if (estate) {
        res.send(estate);
      } else {
        throw new NotFoundError(ERROR_TEXT_NOT_FOUND_USERS.message);
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

module.exports.deleteEstate = (req, res, next) => {
  Estate.findByIdAndRemove(req.params.estateId)
    .then((estate) => {
      res.send({ estate });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(ERROR_TEXT_BED_REQUEST.message));
      } else {
        next(err);
      }
    });
};
