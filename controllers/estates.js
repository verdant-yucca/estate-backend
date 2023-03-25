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
    title, price, address, target, info, typeEstate
  } = req.body;

  const apartment = {};
  const office = {};
  const home = {};

  if (typeEstate==="apartment") {
    if (req.body.floor) {apartment.floor = req.body.floor;}
    if (req.body.status) {apartment.status = req.body.status;}
    if (req.body.rooms) {apartment.rooms = req.body.rooms;}
    if (req.body.square) {apartment.square = req.body.square;}
    if (req.body.kitchen_square) {apartment.kitchen_square = req.body.kitchen_square;}
    if (req.body.living_space) {apartment.living_space = req.body.living_space;}
    if (req.body.total_floors) {apartment.total_floors = req.body.total_floors;}
    if (req.body.height) {apartment.height = req.body.height;}
    if (req.body.bathroom) {apartment.bathroom = req.body.bathroom;}
    if (req.body.repair) {apartment.repair = req.body.repair;}
    if (req.body.furniture) {apartment.furniture = req.body.furniture;}
  } else if (typeEstate==="office") {
    if (req.body.floor) {office.floor = req.body.floor;}
    if (req.body.square) {office.floor = req.body.square;}
    if (req.body.power_grid_capacity) {office.power_grid_capacity = req.body.power_grid_capacity;}
    if (req.body.purpose) {office.purpose = req.body.purpose;}
    if (req.body.room_layout) {office.room_layout = req.body.room_layout;}
    if (req.body.heating) {office.heating = req.body.heating;}
    if (req.body.separate_entrance) {office.separate_entrance = req.body.separate_entrance;}
  } else if (typeEstate==="home") {
    if (req.body.rooms) {home.rooms = req.body.rooms;}
    if (req.body.square) {home.square = req.body.square;}
    if (req.body.plot_area) {home.plot_area = req.body.plot_area;}
    if (req.body.house_floors) {home.house_floors = req.body.house_floors;}
    if (req.body.year_built) {home.year_built = req.body.year_built;}
    if (req.body.land_category) {home.land_category = req.body.land_category;}
    if (req.body.wall_material) {home.wall_material = req.body.wall_material;}
    if (req.body.heating) {home.heating = req.body.heating;}
    if (req.body.toilet) {home.toilet = req.body.toilet;}
    if (req.body.repair) {home.repair = req.body.repair;}
    if (req.body.water_supply) {home.water_supply = req.body.water_supply;}
    if (req.body.electricity) {home.electricity = req.body.electricity;}
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
      title, price, address, images, target, createDate, apartment, office, home, info, typeEstate
    })
      .then((estate) => {
        const obj = {
          title: estate.title,
          price: estate.price,
          images: estate.images,
          typeEstate: estate.typeEstate,
          views: 0,
          address: estate.address,
          target: estate.target,
          createDate: estate.createDate,
          _id: estate._id,
        };
        res.send({estate: obj});
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
  // const {
  //   price
  // } = req.query
  // if (price)
  let query = req.query;
  // console.log(query)

  // if (target) query.append(target: target)
  let fields = {title: 1, price: 1, views: 1, images: 1,  typeEstate: 1, address: 1, target:1, apartment: 1, office: 1, home: 1, createDate: 1, _id: 1};
  const perPage = 20;
  const page = req.query.page ? req.query.page : 0;

  Estate.find(query, fields).sort({"_id": -1}).skip(page*perPage).limit(perPage)
    .then((estates) => {
      const newEstates = estates.map(estate=>{
        const obj = {
          'title': estate.title,
          'price': estate.price,
          'views': estate.views.length,
          'images': estate.images,
          'address': estate.address,
          'target': estate.target,
          'typeEstate': estate.typeEstate,
          'createDate': estate.createDate,
          '_id': estate._id
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
        const newEstate = {
          'title': estate.title,
          'price': estate.price,
          'views': estate.views.length,
          'images': estate.images,
          'address': estate.address,
          'createDate': estate.createDate,
          'info': estate.info,
          'typeEstate': estate.typeEstate,
          '_id': estate._id
        };
        let estateString = JSON.stringify(estate)
        let estateJSON = JSON.parse(estateString)
        if (estateJSON.apartment) {
          newEstate.apartment = estate.apartment;
        }
        if (estateJSON.office) {
          newEstate.office = estate.office;
        }
        if (estateJSON.home) {
          newEstate.home = estate.home;
        }
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
  // TODO: Дописать функцию обновления данных
  const {
    title, price, address, info, image, target, typeEstate,
    apartment, office, home
  } = req.body;
  Estate.findByIdAndUpdate(
    req.estate._id,
    {
      title, price, address, info, image, target, typeEstate,
      apartment, office, home
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
