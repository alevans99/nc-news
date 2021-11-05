//Sends back connected message
exports.getConnectedMessage = async (req, res, next) => {

    res.status(200).send({
        message: "Connected - use /api to view possible endpoints"
    })

}
