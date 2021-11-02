const articlesRouter = require('express').Router();

const {
    getArticleById,
    patchArticleById
} = require("../controllers/articles-controllers")


articlesRouter
    .route("/:id")
    .get(getArticleById)
    .patch(patchArticleById)



module.exports = articlesRouter
