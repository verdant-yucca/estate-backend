const path = require('path');
const { imgList } = require('../utils/constants');
const fs = require("fs");

module.exports.moveFiles = (files, outDir) => {
  let result = {
    images: [],
    error: []
  };

// TODO: починить загрузку одного файла

  //if (typeof files === "array") {
    files.forEach(item=>{
      let extName = path.extname(item.name);
      let uploadFile = path.join(outDir, item.md5+extName);

      if(!imgList.includes(extName)){
        fs.unlinkSync(item.tempFilePath);
        result.error.push([422, "Invalid Image"]);
        return result
      }

      // Checking file size
      if(item.size > 90048576){
        // TODO: закодить сжатие больших файлов
        fs.unlinkSync(item.tempFilePath);
        result.error.push([413, "File is too Large"]);
        return result
      }
      result.images.push(uploadFile);

      // Сохраняем файл
      item.mv(uploadFile, (err) => {
        if (err) {
          result.error.push([500, err]);
          return result;
        }
      });
    });
    return result
  //}
  //  return result;
  //}

}
