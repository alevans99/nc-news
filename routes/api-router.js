const apiRouter = require('express').Router();
const topicsRouter = require('./topics-router')
const articlesRouter = require('./articles-router')
const {
    methodNotAllowed,
    connected
} = require("../utils")

const commentsRouter = require('./comments-router')

apiRouter
    .route('/')
    .get(connected)
    .all(methodNotAllowed)



apiRouter.use('/topics', topicsRouter)
apiRouter.use('/articles', articlesRouter)
apiRouter.use('/comments', commentsRouter)

module.exports = apiRouter;
