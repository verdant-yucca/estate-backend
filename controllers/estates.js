const Estate = require('../models/estate');
const fs = require('fs');
const path = require('path');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const {
  ERROR_BED_REQUEST,
  ERROR_NOT_FOUND,
} = require('../utils/constants');

// title, price, address, image, target

module.exports.createEstate = (req, res, next) => {
  const {
    title, price, address, target,
  } = req.body;
  // проверка запроса на наличие файлов и наименование ключей
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  let ress = 0;
  const imgList = ['.png','.jpg','.jpeg','.gif'];
  const targetFile = req.files.images;
  let images = [];

  targetFile.forEach(item=>{
    let extName = path.extname(item.name);

    // Checking the file type
    if(!imgList.includes(extName)){
      fs.unlinkSync(item.tempFilePath);
      return res.status(422).send("Invalid Image");
    }

    // Checking file size
    if(item.size > 90048576){
      // TODO: закодить сжатие больших файлов
      fs.unlinkSync(item.tempFilePath);
      return res.status(413).send("File is too Large");
    }

    images.push(path.join(__dirname, '..', 'public','images','estates', item.md5+extName));
  })

  targetFile.forEach(item=>{
    let extName = path.extname(item.name);
    let uploadFile = path.join(__dirname, '..', 'public','images','estates', item.md5+extName);

    // Checking the file type
    if(!imgList.includes(extName)){
      fs.unlinkSync(item.tempFilePath);
      return res.status(422).send("Invalid Image");
    }

    // Checking file size
    if(item.size > 90048576){
      // TODO: закодить сжатие больших файлов
      fs.unlinkSync(item.tempFilePath);
      return res.status(413).send("File is too Large");
    }

    // Сохраняем файл
    item.mv(uploadFile, (err) => {
      if (err)
        return res.status(500).send(err);
    });

  })



  Estate.create({
    title, price, address, images, target,
  })
    .then((estate) => res.send({
      estate: {
        title: estate.title,
        price: estate.price,
        images: estate.images,
        address: estate.address,
        _id: estate._id,
      },
    }))
    .catch((err) => {
      if (err.code === ERROR_BED_REQUEST.code) {
        next(new BadRequestError(ERROR_BED_REQUEST.message));
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
