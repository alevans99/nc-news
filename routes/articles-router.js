const articlesRouter = require('express').Router();

const {
    getArticleById,
    patchArticleById,
    getArticles
} = require("../controllers/articles-controllers")


articlesRouter
    .route("/")
    .get(getArticles)

articlesRouter
    .route("/:id")
    .get(getArticleById)
    .patch(patchArticleById)



module.exports = articlesRouter
