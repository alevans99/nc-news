const articlesRouter = require('express').Router();

const {
    getArticleById,
    patchArticleById,
    getArticles,
    getCommentsByArticleId,
    postCommentToArticleId,
    postArticle,
    deleteArticleById
} = require("../controllers/articles-controllers")


const {
    methodNotAllowed,

} = require("../controllers/error-controllers")

//Routes('api/articles/')
articlesRouter
    .route("/")
    .get(getArticles)
    .post(postArticle)
    .all(methodNotAllowed)

articlesRouter
    .route("/:id")
    .get(getArticleById)
    .patch(patchArticleById)
    .delete(deleteArticleById)
    .all(methodNotAllowed)


articlesRouter
    .route("/:id/comments")
    .get(getCommentsByArticleId)
    .post(postCommentToArticleId)
    .all(methodNotAllowed)




module.exports = articlesRouter
