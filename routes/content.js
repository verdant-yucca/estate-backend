const contentRouter = require('express').Router();
const { getContent, getContents, clearContent, createContent, updateContent } = require('../controllers/content');
const {contentIdValidation} = require("../middlewares/validatons");


contentRouter.post('/content', createContent);
contentRouter.get('/content', getContents);
contentRouter.get('/content/:contentId', contentIdValidation, getContent);
contentRouter.patch('/content', updateContent);
contentRouter.patch('/content', clearContent);

module.exports = contentRouter;