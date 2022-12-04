const router = require('express').Router();
const usersRouter = require('./users');
const estateRouter = require('./estate');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { createUserValidation, loginValidation } = require('../middlewares/validatons');
const NotFoundError = require('../errors/NotFoundError');

router.post('/signin', loginValidation, login);
router.post('/signup', createUserValidation, createUser);

router.use(estateRouter);

router.use(auth);

router.use(usersRouter);
router.use('/*', () => {
  throw new NotFoundError('Страница по указанному маршруту не найдена');
});

module.exports = router;
