const usersRouter = require('express').Router();
const {
  updateUserValidation,
  updateAvatarValidation,
  userIdValidation,
} = require('../middlewares/validatons');

const {
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
  getMe,
} = require('../controllers/users');

usersRouter.get('/users', getUsers);
usersRouter.get('/users/me', getMe);
usersRouter.get('/users/:userId', userIdValidation, getUser);
usersRouter.patch('/users/me', updateUserValidation, updateUser);
usersRouter.patch('/users/me/avatar', updateAvatarValidation, updateAvatar);

module.exports = usersRouter;
