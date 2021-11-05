const articlesRouter = require('express').Router();

const {
    getArticleById,
    patchArticleById,
    getArticles,
    getCommentsByArticleId,
    postCommentToArticleId
} = require("../controllers/articles-controllers")


const {
    methodNotAllowed,

} = require("../controllers/error-controllers")

//Routes('api/articles/')
articlesRouter
    .route("/")
    .get(getArticles)
    .all(methodNotAllowed)

articlesRouter
    .route("/:id")
    .get(getArticleById)
    .patch(patchArticleById)
    .all(methodNotAllowed)


articlesRouter
    .route("/:id/comments")
    .get(getCommentsByArticleId)
    .post(postCommentToArticleId)
    .all(methodNotAllowed)




module.exports = articlesRouter
