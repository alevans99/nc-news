const topicsRouter = require('express').Router();
const {
    methodNotAllowed,

} = require("../controllers/error-controllers")

const {
    getTopics,
    postTopic
} = require("../controllers/topics-controllers")


//Routes('api/topics/')
topicsRouter
    .route("/")
    .get(getTopics)
    .post(postTopic)
    .all(methodNotAllowed)

module.exports = topicsRouter
