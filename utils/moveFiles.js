const path = require('path');
const { imgList } = require('../utils/constants');
const fs = require("fs");
const chalk = require("chalk");

let result = {
  images: [],
  error: []
};

function moveFile(file, outDir){
  let extName = path.extname(file.name);
  let uploadFile = file.md5+extName;
  let fileName = file.md5;


  if(!imgList.includes(extName)){
    fs.unlinkSync(file.tempFilePath);
    result.error.push([422, "Invalid Image"]);
    return result
  }

  // Checking file size
  if(file.size > 90048576){
    // TODO: закодить сжатие больших файлов
    fs.unlinkSync(file.tempFilePath);
    result.error.push([413, "File is too Large"]);
    return result
  }
  result.images.push(fileName+'.webp');

  // Сохраняем файл
  file.mv(path.join(outDir, uploadFile), (err) => {
    if (err) {
      result.error.push([500, err]);
      return result;
    }
  });
}

module.exports.moveFiles = (inData, outDir) => {


// TODO: починить загрузку одного файла
  console.log(chalk.yellow('var "files" keys ', Object.keys(inData)));
  console.log(chalk.yellow('var "files" values ', Object.values(inData)));
  if (inData.length > 1) {
    console.log(chalk.yellow('var "files" length ', inData.length));
    inData.forEach((item)=>{
      moveFile(item,outDir)
    });
    return result
  }
  else {

  }
  //  return result;
  //}

}
