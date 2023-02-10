const path = require('path');
const { imgList } = require('../utils/constants');
const fs = require("fs");
// const chalk = require("chalk");
const {baseUrlImageEstate} = require("./constants");


function moveFile(file, outDir){
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, {recursive: true});
  let extName = path.extname(file.name);
  let uploadFile = file.md5+extName;
  let fileName = file.md5;


  if(!imgList.includes(extName)){
    fs.unlinkSync(file.tempFilePath);
    return [422, "Invalid Image"]
  }

  // Checking file size
  if(file.size > 90048576){
    // TODO: закодить сжатие больших файлов
    fs.unlinkSync(file.tempFilePath);
    return [413, "File is too Large"]
  }
  // Сохраняем файл
  file.mv(path.join(outDir, uploadFile), (err) => {
    if (err) {
      return [500, err]; //TODO: дождаться выполения на уровне выше
    }
  });
  return [200, fileName + '.webp'];
}

module.exports.moveFiles = (inData, outDir) => {
let images = [200, []];
  if (inData.length > 0) {
    inData.forEach((item)=>{
      let res = moveFile(item,outDir);
      if (res[0] === 200 ) {
        images[1].push(res[1]);
      }
      else {
        // TODO: удаляем скопированные файлы
        if(images[1].length>0) {
          images[1].forEach((image) => {
            fs.rmSync(path.join(baseUrlImageEstate, image))
          })
        }
        inData.forEach((item) => {
          if (fs.existsSync(item.tempFilePath)) {
            fs.rmSync(item.tempFilePath)
          }
        })
        return res;
      }
    });
    return images;
  }
  else {
    let res = moveFile(inData,outDir);
    if (res[0] === 200) {
      images[1].push(res[1]);
      return images;
    }
    else return res;
  }
}
