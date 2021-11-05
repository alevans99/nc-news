const {
    selectTopics,
    insertTopic
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

exports.postTopic = async (req, res, next) => {

    try {

        const {
            slug,
            description
        } = req.body;

        const topic = await insertTopic(slug, description)

        res.status(201).send({
            topic
        })

    } catch (err) {
        next(err)
    }

}
