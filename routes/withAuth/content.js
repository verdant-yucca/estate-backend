const contentRouter = require('express').Router();
const { clearContent, createContent, updateContent } = require('../../controllers/content');
const {contentIdValidation} = require("../../middlewares/validatons");


contentRouter.post('/content', createContent);
contentRouter.patch('/content/:contentId', contentIdValidation, updateContent);
contentRouter.patch('/content/:contentId', contentIdValidation, clearContent);

module.exports = contentRouter;