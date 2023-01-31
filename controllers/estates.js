const Estate = require('../models/estate');
// const path = require('path');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const {
  ERROR_BED_REQUEST,
  ERROR_NOT_FOUND, baseUrlImageEstate, dirCompressedImagesEstate
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
    const createDate = Date.now();

    Estate.create({
      title, price, address, images, target, createDate
    })
      .then((estate) => {
        res.send({
          estate: {
            title: estate.title,
            price: estate.price,
            images: estate.images,
            views: estate.views,
            address: estate.address,
            createDate: estate.createDate,
            _id: estate._id,
          },
        });
        //cladr(estate._id, address);

        let dirUncompressedImages = 'public/images/estates/uncompressed/*.{jpg,JPG,jpeg,JPEG}'
        compressImages(dirUncompressedImages,dirCompressedImagesEstate,true);
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
  let fields = {title: 1, price: 1, views: 1, images: 1, address: 1, createDate: 1, _id: 1};
  const perPage = 20;
  const { page = 0 } = req.body;


  // if (req.params) {
  //   let str = req.params.1 + req.params.1 + req.params.1 + req.params.1;
  // }
  Estate.find(query, fields).sort({"_id": -1}).skip(page*perPage).limit(perPage)
    .then((estates) => {
      const newEstates = estates.map(estate=>{
        const newEstate = {
          'title': estate.title,
          'price': estate.price,
          'views': estate.views.length,
          'images': estate.images,
          'address': estate.address,
          'createDate': estate.createDate,
          '_id': estate._id
        };
         return newEstate;
      })
      res.send(newEstates);
    })

    .catch(next);
};

module.exports.getEstate = (req, res, next) => {
  Estate.findById(req.params.estateId)
    .then((estate) => {
      if (estate) {
        // отправляем пользователю ответ
        const newEstate = {
          'title': estate.title,
          'price': estate.price,
          'views': estate.views.length,
          'images': estate.images,
          'address': estate.address,
          'createDate': estate.createDate,
          '_id': estate._id
        };
        res.send(newEstate);

        // добавляем ip юзера в бд
        let isContains = false;
        const viewsEstate = estate['views'];
        const clientIP = req.headers["x-forwarded-for"];

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
