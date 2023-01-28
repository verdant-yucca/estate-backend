const routerWithAuth = require('express').Router();
const usersRouter = require('./users');
const estateRouter = require('./estate');
const contentRouter = require('./content');

//TODO отправлять email в checkAuth

routerWithAuth.use('/checkAuth', (req, res) => {res.sendStatus(200)})
routerWithAuth.use(estateRouter);
routerWithAuth.use(contentRouter);
routerWithAuth.use(usersRouter);

module.exports = routerWithAuth;
