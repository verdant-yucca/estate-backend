const contentRouter = require('express').Router();
const { clearContent, createContent, updateContent } = require('../../controllers/content');
const {contentIdValidation} = require("../../middlewares/validatons");

//TODO починить роуты, надо добавить id

contentRouter.post('/content', createContent);
contentRouter.patch('/content/:contentId', contentIdValidation, updateContent);
contentRouter.patch('/content/:contentId', contentIdValidation, clearContent);

module.exports = contentRouter;