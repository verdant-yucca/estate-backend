const contentRouter = require('express').Router();
const auth = require('../middlewares/auth');
const { getContent, getContents, clearContent, createContent, updateContent } = require('../controllers/content');
const {contentIdValidation} = require("../middlewares/validatons");



contentRouter.get('/content', getContents);
contentRouter.get('/content/:contentId', contentIdValidation, getContent);
contentRouter.use(auth);
contentRouter.post('/content', createContent);
contentRouter.patch('/content', updateContent);
contentRouter.patch('/content', clearContent);

module.exports = contentRouter;