const {
    fetchEndpoints
} = require('../models/api-models')

//Sends back all endpoints available
exports.getApi = async (req, res, next) => {

    const endpoints = fetchEndpoints()

    res.status(200).send({
        endpoints
    })

}
