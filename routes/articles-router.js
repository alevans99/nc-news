const articlesRouter = require('express').Router();

const {
    getArticleById
} = require("../controllers/articles-controllers")


articlesRouter
    .route("/:id")
    .get(getArticleById)

module.exports = articlesRouter
