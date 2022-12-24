const fs = require('fs');
const path = require('path');
const {baseUrlImageEstate, buildUrlImageEstate} = process.env;


module.exports = compressImagesRouter(req, res, next) => {
  //TODO: написать код, принимающий картинки с baseUrlImageEstate, после сжатия сохраняющий в buildUrlImageEstate и переписывающий
  console.log('req: ', req);

}