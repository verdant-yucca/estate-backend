const Content = require('../models/content');
const {ERROR_BED_REQUEST, ERROR_NOT_FOUND, baseUrlImageContent, dirCompressedImagesContent} = require("../utils/constants");
const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");
const {moveFiles} = require("../utils/moveFiles");
const {compressImages} = require("../utils/imageUtils");
const dirUncompressedImages = 'public/images/contents/uncompressed/*.{jpg,JPG,jpeg,JPEG}'

module.exports.createContent = (req, res, next) => {
  const {name, text} = req.body;
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  //TODO base url
  const moveFilesResult = moveFiles(req.files.images, baseUrlImageContent);
  if (moveFilesResult[0] !== 200) {
    res.status(moveFilesResult[0]).send(moveFilesResult[1]);
  } else {
    const images = moveFilesResult[1];

    const content = new Object({
      name: name,
      text: text,
      image: images[0]
    })

    Content.create(content)
      .then((content) => {
        res.send(content);
        compressImages(dirUncompressedImages, dirCompressedImagesContent, true);
      })
      .catch((err) => {
        if (err.code === ERROR_BED_REQUEST.code) {
          next(new BadRequestError(ERROR_BED_REQUEST.message));
        } else {
          next(err);
        }
      });
  }
}

  module.exports.updateContent = (req, res, next) => {
    const {name, text, image} = req.body;
    Content.findByIdAndUpdate(
      req.content._id,
      {name, text, image},
      {
        new: true,
        runValidators: true,
      },
    )
      .then((content) => {
          if (content) {
            res.send(content)
          } else {
            throw new NotFoundError(ERROR_NOT_FOUND.messageContent);
          }
        }
      )
      .catch((err) => {
        if (err.code === ERROR_BED_REQUEST.code) {
          next(new BadRequestError(ERROR_BED_REQUEST.message));
        } else {
          next(err);
        }
      });
  }

  module.exports.getContent = (req, res, next) => {
    Content.findById(req.params.contentId)
      .then(content => {
        if (content) {
          res.send(content);
        } else throw new NotFoundError(ERROR_NOT_FOUND.messageContent);
      })
      .catch((err) => {
        if (err.code === ERROR_BED_REQUEST.code) {
          next(new BadRequestError(ERROR_BED_REQUEST.message));
        } else {
          next(err);
        }
      });
  }

  module.exports.getContents = (req, res, next) => {
    Content.find({})
      .then((contents) => {
        res.send(contents);
      })
      .catch(next);
  }

  module.exports.clearContent = (req, res, next) => {
    Content.findByIdAndUpdate(
      req.content._id,
      {text: '', image: ''},
      {
        new: true,
        runValidators: true,
      },
    )
      .then((content) => {
          if (content) {
            res.send(content)
          } else {
            throw new NotFoundError(ERROR_NOT_FOUND.messageContent);
          }
        }
      )
      .catch((err) => {
        if (err.code === ERROR_BED_REQUEST.code) {
          next(new BadRequestError(ERROR_BED_REQUEST.message));
        } else {
          next(err);
        }
      });
  }