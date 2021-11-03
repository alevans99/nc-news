const topicsRouter = require('express').Router();
const {
    methodNotAllowed
} = require("../utils")

const {
    getTopics
} = require("../controllers/topics-controllers")



topicsRouter
    .route("/")
    .get(getTopics)
    .all(methodNotAllowed)

module.exports = topicsRouter
