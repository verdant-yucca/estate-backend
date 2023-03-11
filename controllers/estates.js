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
    title, price, address, target, info
  } = req.body;
  const apartment = {};
  if (req.body.floor) {
    apartment.floor = req.body.floor;
  }
  if (req.body.status) {
    apartment.status = req.body.status;
  }
  if (req.body.rooms) {
    apartment.rooms = req.body.rooms;
  }
  if (req.body.square) {
    apartment.square = req.body.square;
  }
  if (req.body.kitchen_square) {
    apartment.kitchen_square = req.body.kitchen_square;
  }
  if (req.body.living_space) {
    apartment.living_space = req.body.living_space;
  }
  if (req.body.total_floors) {
    apartment.total_floors = req.body.total_floors;
  }
  if (req.body.height) {
    apartment.height = req.body.height;
  }
  if (req.body.bathroom) {
    apartment.bathroom = req.body.bathroom;
  }
  if (req.body.repair) {
    apartment.repair = req.body.repair;
  }
  if (req.body.furniture) {
    apartment.furniture = req.body.furniture;
  }

  // проверка запроса на наличие файлов и наименование ключей
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  //const moveFilesResult = moveFiles(req.files, baseUrlImageEstate); //.images
  const moveFilesResult = moveFiles(Array.from(Object.values(req.files)), baseUrlImageEstate); //.images
  if (moveFilesResult[0] !== 200){
    res.status(moveFilesResult[0]).send(moveFilesResult[1]);
  } else {
    const images = moveFilesResult[1];
    const createDate = Date.now();

    Estate.create({
      title, price, address, images, target, createDate, apartment, info
    })
      .then((estate) => {
        res.send({
          estate: {
            title: estate.title,
            price: estate.price,
            images: estate.images,
            views: 0,
            address: estate.address,
            createDate: estate.createDate,
            apartment: estate.apartment,
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
  let fields = {title: 1, price: 1, views: 1, images: 1, address: 1, apartment: 1, office: 1, home: 1, createDate: 1, _id: 1};
  const perPage = 20;
  const page = req.query.page ? req.query.page : 0;
  console.log(page)


  // if (req.params) {
  //   let str = req.params.1 + req.params.1 + req.params.1 + req.params.1;
  // }
  Estate.find(query, fields).sort({"_id": -1}).skip(page*perPage).limit(perPage)
    .then((estates) => {
      const newEstates = estates.map(estate=>{
        const obj = {
          'title': estate.title,
          'price': estate.price,
          'views': estate.views.length,
          'images': estate.images,
          'address': estate.address,
          'createDate': estate.createDate,
          '_id': estate._id
        }
        let estateString = JSON.stringify(estate)
        let estateJSON = JSON.parse(estateString)
        if (estateJSON.apartment) {
          obj.apartment = estate.apartment;
        }
        if (estateJSON.office) {
          obj.office = estate.office;
        }
        if (estateJSON.home) {
          obj.home = estate.home;
        }

        return obj;
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
          'info': estate.info,
          'apartment': estate.apartment,
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
