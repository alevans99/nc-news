const {
    selectTopics
} = require("../models/topics-models")


exports.getTopics = async (req, res, next) => {

    try {

        const listOfTopics = await selectTopics()

        res.status(200).send({
            topics: listOfTopics
        })

    } catch (err) {
        next(err)
    }



}
