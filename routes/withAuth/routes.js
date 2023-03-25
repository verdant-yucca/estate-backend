const routerWithAuth = require('express').Router();
const usersRouter = require('./users');
const estateRouter = require('./estate');
const reviewRouter = require('./review');
const contentRouter = require('./content');

//TODO отправлять email в checkAuth

routerWithAuth.use('/checkAuth', (req, res) => {res.sendStatus(200);})
routerWithAuth.use(estateRouter);
routerWithAuth.use(reviewRouter);
routerWithAuth.use(contentRouter);
routerWithAuth.use(usersRouter);

routerWithAuth.use('/*', () => {throw new NotFoundError('Страница по указанному маршруту не найдена');
});

module.exports = routerWithAuth;
