const routerNoneAuth = require('express').Router();
const estateRouter = require('./estate');
const contentRouter = require('./content');
const { login, createUser } = require('../../controllers/users');
const { createUserValidation, loginValidation } = require('../../middlewares/validatons');
const NotFoundError = require('../../errors/NotFoundError');
const telegramRouter = require('./telegram');
const express = require("express");
const {buildUrlImageEstate, buildUrlImageContent} = require("../../utils/constants");

routerNoneAuth.post('/signin', loginValidation, login);
routerNoneAuth.post('/signup', createUserValidation, createUser);

routerNoneAuth.use(estateRouter);
routerNoneAuth.use(contentRouter);

routerNoneAuth.use('/transfer', telegramRouter);
routerNoneAuth.use('/images/estate', express.static(buildUrlImageEstate))

routerNoneAuth.use('/images/content', express.static(buildUrlImageContent))

routerNoneAuth.use('/*', () => {throw new NotFoundError('Страница по указанному маршруту не найдена');
});

module.exports = routerNoneAuth;
