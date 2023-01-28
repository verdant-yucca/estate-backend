const contentRouter = require('express').Router();
const { getContent, getContents} = require('../../controllers/content');
const {contentIdValidation} = require("../../middlewares/validatons");

contentRouter.get('/content', getContents);
contentRouter.get('/content/:contentId', contentIdValidation, getContent);

module.exports = contentRouter;