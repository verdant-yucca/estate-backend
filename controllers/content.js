const Content = require('../models/content');
const {ERROR_BED_REQUEST, ERROR_NOT_FOUND} = require("../utils/constants");
const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");


module.exports.createContent = (req, res, next) => {
  const {name, text, image} = req.body;
  Content.create({
    name, text, image
  })
    .then((content) => res.send(content))
    .catch((err) => {
      if (err.code === ERROR_BED_REQUEST.code) {
        next(new BadRequestError(ERROR_BED_REQUEST.message));
      } else {
        next(err);
      }
    });
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
    .then((content)=>{
      if (content){
        res.send(content)
      }else {
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
      if(content){
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
   .then((contents) =>{
     res.send(contents);
   })
   .catch(next);
}

module.exports.clearContent = (req, res, next) => {
  Content.findByIdAndUpdate(
    req.content._id,
    { text:'', image:''},
    {
      new: true,
      runValidators: true,
    },
  )
    .then((content)=>{
        if (content){
          res.send(content)
        }else {
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