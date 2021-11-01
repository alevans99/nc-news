const apiRouter = require('express').Router();
const topicsRouter = require('./topics-router')
const articlesRouter = require('./articles-router')

apiRouter.get('/', (req, res) => {
    res.status(200).send({
        message: "Connected"
    });
});

apiRouter.use('/topics', topicsRouter)
apiRouter.use('/articles', articlesRouter)

module.exports = apiRouter;
