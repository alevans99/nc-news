const commentsRouter = require('express').Router();
const {
    methodNotAllowed
} = require("../utils")

const {
    deleteComment
} = require("../controllers/comments-controllers")



commentsRouter
    .route("/:comment_id")
    .delete(deleteComment)
    .all(methodNotAllowed)

//Routes('api/comments/')
commentsRouter
    .route("/")
    .all(methodNotAllowed)

module.exports = commentsRouter
