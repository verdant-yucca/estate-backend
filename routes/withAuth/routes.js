const router = require('express').Router();
const usersRouter = require('./users');
const estateRouter = require('./estate');
const contentRouter = require('./content');

//TODO отправлять email в checkAuth

router.use('/checkAuth', (req, res) => {res.send('admin@email.ru')})
router.use(estateRouter);
router.use(contentRouter);
router.use(usersRouter);

module.exports = router;
