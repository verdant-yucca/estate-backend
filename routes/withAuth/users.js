const usersRouter = require('express').Router();
const {
  updateUserValidation,
} = require('../../middlewares/validatons');

const {
  getUsers,
  updateUser,
} = require('../../controllers/users');

usersRouter.get('/users', getUsers);
usersRouter.patch('/users/me', updateUserValidation, updateUser);

module.exports = usersRouter;
