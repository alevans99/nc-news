const {
  selectUsers,
  selectUserByUsername,
  selectCommentsByUsername,
  selectArticlesByUsername,
} = require('../models/users-models');

exports.getUsers = async (req, res, next) => {
  try {
    const users = await selectUsers();

    res.status(200).send({
      users,
    });
  } catch (err) {
    next(err);
  }
};

exports.getUserByUsername = async (req, res, next) => {
  try {
    const { username } = req.params;

    const user = await selectUserByUsername(username);

    res.status(200).send({
      user,
    });
  } catch (err) {
    next(err);
  }
};

exports.getCommentsByUsername = async (req, res, next) => {
  try {
    const { username } = req.params;
    const { p: page } = req.query;

    const { comments, total_count } = await selectCommentsByUsername(
      username,
      10,
      page
    );

    res.status(200).send({
      comments,
      total_count,
    });
  } catch (err) {
    next(err);
  }
};

exports.getArticlesByUsername = async (req, res, next) => {
  try {
    const { username } = req.params;
    const { p: page } = req.query;

    const { articles, total_count } = await selectArticlesByUsername(
      username,
      10,
      page
    );

    res.status(200).send({
      articles,
      total_count,
    });
  } catch (err) {
    next(err);
  }
};
