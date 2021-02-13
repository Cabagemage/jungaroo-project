const userRouter = require('express').Router();

const {
  getOwnerInfo, getUsers
} = require('../controllers/users');

userRouter.get('/', getUsers);

userRouter.get('/me', getOwnerInfo);

module.exports = userRouter;
