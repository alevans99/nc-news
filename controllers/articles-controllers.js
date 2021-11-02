const {
    selectArticleById,
    updateArticleById
} = require("../models/articles-models")

exports.getArticleById = async (req, res, next) => {

    const {
        id
    } = req.params;


    try {
        const article = await selectArticleById(id)

        res.status(200).send({
            article
        })

    } catch (err) {
        next(err)
    }

}


exports.patchArticleById = async (req, res, next) => {
    try {
        const {
            id
        } = req.params;

        const {
            inc_votes: changeVotes
        } = req.body


        if (Object.keys(req.body).length > 1 && !Object.hasOwnProperty('inc_votes')) {
            await Promise.reject({
                status: 400,
                message: "Invalid Request"
            })
        }



        const article = await updateArticleById(id, changeVotes)

        res.status(201).send({
            article
        })

    } catch (err) {

        next(err)
    }

}
