const commentsRouter = require('express').Router();
const {
    methodNotAllowed,


} = require("../controllers/error-controllers")

const {
    deleteComment,
    patchComment
} = require("../controllers/comments-controllers")



commentsRouter
    .route("/:comment_id")
    .delete(deleteComment)
    .patch(patchComment)
    .all(methodNotAllowed)

//Routes('api/comments/')
commentsRouter
    .route("/")
    .all(methodNotAllowed)

module.exports = commentsRouter
