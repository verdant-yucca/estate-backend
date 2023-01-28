const contentRouter = require('express').Router();
const { clearContent, createContent, updateContent } = require('../../controllers/content');
const {contentIdValidation} = require("../../middlewares/validatons");

//TODO починить роуты, надо добавить id

contentRouter.post('/content', createContent);
contentRouter.patch('/content', updateContent);
contentRouter.patch('/content', clearContent);

module.exports = contentRouter;