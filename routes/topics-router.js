const topicsRouter = require('express').Router();
const {
    methodNotAllowed
} = require("../utils")

const {
    getTopics
} = require("../controllers/topics-controllers")


//Routes('api/topics/')
topicsRouter
    .route("/")
    .get(getTopics)
    .all(methodNotAllowed)

module.exports = topicsRouter
