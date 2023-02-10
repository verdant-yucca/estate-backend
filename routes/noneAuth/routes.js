const routerNoneAuth = require('express').Router();
const estateRouter = require('./estate');
const contentRouter = require('./content');
const { login, createUser } = require('../../controllers/users');
const { createUserValidation, loginValidation } = require('../../middlewares/validatons');
const telegramRouter = require('./telegram');
const express = require("express");
const {buildUrlImageEstate, buildUrlImageContent} = require("../../utils/constants");
const reviewRouter = require("./review");

routerNoneAuth.post('/signin', loginValidation, login);
routerNoneAuth.post('/signup', createUserValidation, createUser);

routerNoneAuth.use(estateRouter);
routerNoneAuth.use(contentRouter);
routerNoneAuth.use(reviewRouter);

routerNoneAuth.use('/transfer', telegramRouter);
routerNoneAuth.use('/images/estate', express.static(buildUrlImageEstate));

routerNoneAuth.use('/images/content', express.static(buildUrlImageContent));

module.exports = routerNoneAuth;
