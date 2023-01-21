const Estate = require('../models/estate');
// const path = require('path');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const {
  ERROR_BED_REQUEST,
  ERROR_NOT_FOUND, baseUrlImageEstate, dirCompressedImages
} = require('../utils/constants');
const {cladr} = require("../utils/cladr");
const {moveFiles} = require("../utils/moveFiles");
const {compressImages} = require("../utils/imageUtils");

module.exports.createEstate = (req, res, next) => {
  const {
    title, price, address, target,
  } = req.body;
  // проверка запроса на наличие файлов и наименование ключей
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  const moveFilesResult = moveFiles(req.files.images, baseUrlImageEstate);
  if (moveFilesResult[0] !== 200){
    res.status(moveFilesResult[0]).send(moveFilesResult[1]);
  } else {
    const images = moveFilesResult[1];
    Estate.create({
      title, price, address, images, target,
    })
      .then((estate) => {
        res.send({
          estate: {
            title: estate.title,
            price: estate.price,
            images: estate.images,
            coords: estate.coords,
            address: estate.address,
            _id: estate._id,
          },
        });
        cladr(estate._id, address);
        let dirUncompressedImages = 'public/images/estates/uncompressed/*.{jpg,JPG,jpeg,JPEG}'
        compressImages(dirUncompressedImages,dirCompressedImages,true);
      })
      .catch((err) => {
        if (err.code === ERROR_BED_REQUEST.code) {
          next(new BadRequestError(ERROR_BED_REQUEST.message));
        } else {
          next(err);
        }
      });
  }
};

module.exports.getEstates = (req, res, next) => {
  let query = {};
  // if (req.params) {
  //   let str = req.params.1 + req.params.1 + req.params.1 + req.params.1;
  // }
  Estate.find(query)
    .then((estates) => res.send(estates))
    .catch(next);
};

module.exports.getEstate = (req, res, next) => {
  Estate.findById(req.params.estateId)
    .then((estate) => {
      if (estate) {
        let isContains = false;
        const viewsEstate = estate['views'];
        const clientIP = req.headers["x-forwarded-for"];


        res.send(estate['views']);

        if (viewsEstate.length > 0) {
          viewsEstate.forEach(item => (item === clientIP) ? (isContains = true) : false);
        }
        if (!isContains) {
          Estate.findByIdAndUpdate(req.params.estateId, {$push: {views: clientIP }})
            .then(estate => console.log(estate['views']))
            .catch(next)
        }
      } else {
        throw new NotFoundError(ERROR_NOT_FOUND.messageEstate);
      }
    })
    .catch((err) => {
      if (err.code === ERROR_BED_REQUEST.code) {
        next(new BadRequestError(ERROR_BED_REQUEST.message));
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
        throw new NotFoundError(ERROR_NOT_FOUND.messageEstate);
      }
    })
    .catch((err) => {
      if (err.code === ERROR_BED_REQUEST.code) {
        next(new BadRequestError(ERROR_BED_REQUEST.message));
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
        next(new BadRequestError(ERROR_BED_REQUEST.message));
      } else {
        next(err);
      }
    });
};
