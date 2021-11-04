const usersRouter = require('express').Router();
const {
    methodNotAllowed
} = require("../utils")

const {
    getUsers
} = require("../controllers/users-controllers")

//Routes('api/users/')
usersRouter
    .route("/")
    .get(getUsers)
    .all(methodNotAllowed)


module.exports = usersRouter
