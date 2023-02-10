const compress_images = require('compress-images');
const fs = require("fs");

module.exports.compressImages = (inDir, outDir, deletedSourcesFiles) => {
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, {recursive: true});
  let ls = fs.readdirSync(outDir);
  console.log('ls outDir = ',ls);
  compress_images(
    inDir,
    outDir,
    {compress_force: true, statistic: true, autoupdate: true},
    true,
    {jpg: {engine: "webp", command: ['-q', '70']}},
    {png: {engine: "webp", command: ['-q', '70']}},
    {svg: {engine: false, command: false}},
    {gif: {engine: false, command: false}},
    function (err, completed, statistic) {
      if (!err && deletedSourcesFiles) {
          fs.rmSync(statistic.input,  {recursive: true, retryDelay: 200});
      }
    }
  );
};