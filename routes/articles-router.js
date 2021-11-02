const articlesRouter = require('express').Router();

const {
    getArticleById,
    patchArticleById,
    getArticles,
    getCommentsByArticleId
} = require("../controllers/articles-controllers")


articlesRouter
    .route("/")
    .get(getArticles)

articlesRouter
    .route("/:id")
    .get(getArticleById)
    .patch(patchArticleById)

articlesRouter
    .route("/:id/comments")
    .get(getCommentsByArticleId)

module.exports = articlesRouter
