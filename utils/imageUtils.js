const compress_images = require('compress-images');
const fs = require("fs");
const {unli} = require("fs");
const {options} = require("./constants");

module.exports.compressImages = (inDir, outDir, deletedSourcesFiles) => {
  //TODO: написать код, принимающий картинки с baseUrlImageEstate, после сжатия сохраняющий в buildUrlImageEstate и переписывающий
  compress_images(
    // 'public/images/estates/uncompressed/*.{jpg,JPG,jpeg,JPEG}',
    // 'public/images/estates/compressed/',
    inDir,
    outDir,
    {compress_force: false, statistic: true, autoupdate: true},
    true,
    {jpg: {engine: "webp", command: ['-q', '70']}},
    {png: {engine: "webp", command: ['-q', '70']}},
    {svg: {engine: false, command: false}},
    {gif: {engine: false, command: false}},
    function (err, completed, statistic) {
      console.log(statistic.input);
      console.log('completed= ', completed);

      if (!err && deletedSourcesFiles) {

          fs.rmSync(statistic.input,  {recursive: true, retryDelay: 200});
            }
    }
  );
};