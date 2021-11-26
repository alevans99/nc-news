const usersRouter = require('express').Router();
const { methodNotAllowed } = require('../controllers/error-controllers');

const {
  getUsers,
  getUserByUsername,
  getCommentsByUsername,
} = require('../controllers/users-controllers');

//Routes('api/users/')
usersRouter.route('/').get(getUsers).all(methodNotAllowed);

usersRouter.route('/:username').get(getUserByUsername).all(methodNotAllowed);

usersRouter
  .route('/:username/comments')
  .get(getCommentsByUsername)
  .all(methodNotAllowed);

module.exports = usersRouter;
