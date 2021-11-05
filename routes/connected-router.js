const connectedRouter = require('express').Router();
const {
    getConnectedMessage
} = require('../controllers/connected-controllers')
const {
    methodNotAllowed,

} = require("../controllers/error-controllers")


//Routes('/')
connectedRouter
    .route('/')
    .get(getConnectedMessage)
    .all(methodNotAllowed)


module.exports = connectedRouter;
