const articlesRouter = require('express').Router();

const {
    getArticleById,
    patchArticleById,
    getArticles,
    getCommentsByArticleId,
    postCommentToArticleId
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
    .post(postCommentToArticleId)



module.exports = articlesRouter
