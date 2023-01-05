const fs = require('fs');
const path = require('path');
const compress_images = require('compress-images');
const {baseUrlImageEstate, buildUrlImageEstate} = require("../utils/constants");
const Estate = require("../models/estate");

module.exports.compressImagesRouter = (req, res, next) => {
  //TODO: написать код, принимающий картинки с baseUrlImageEstate, после сжатия сохраняющий в buildUrlImageEstate и переписывающий

  //compress_images(input, output, option, globoption, enginejpg, enginepng, enginesvg, enginegif, callback)
  let timeStart = Date.now();
  console.log(baseUrlImageEstate);
  //TODO
  compress_images(
    baseUrlImageEstate+'/*.{jpg,JPG,jpeg,JPEG}',
    buildUrlImageEstate,
    { compress_force: false, statistic: true, autoupdate: true },
    false,
    { jpg: { engine: "webp", command: ['-q', '70'] } },
    { png: { engine: "webp", command: ['-q', '70'] } },
    { svg: { engine: false, command: false } },
    { gif: { engine: false, command: false } },
    function (err, completed, statistic) {
      // console.log('error_compress ', err);
      // console.log('completed ', completed);
      //console.log('statistic ', statistic);


      if (completed) {
        Estate.find({ images: statistic.input})
          .then((estates) => console.log(estates))
          .catch(err => console.log(err));
      }
    }
  );
  let timeEnd = Date.now()-timeStart;
  let resultCompress = 'Files compressed in ' + timeEnd + ' millsec';
  res.status(200).send(resultCompress);
};