const compress_images = require('compress-images');
const fs = require("fs");

module.exports.compressImages = (inDir, outDir, deletedSourcesFiles) => {
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, {recursive: true});
  compress_images(
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