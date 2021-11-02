const {
    selectArticleById,
    updateArticleById,
    selectArticles,
    selectCommentsByArticleId
} = require("../models/articles-models")


exports.getCommentsByArticleId = async (req, res, next) => {

    try {
        const {
            id
        } = req.params;

        const comments = await selectCommentsByArticleId(id)

        res.status(200).send({
            comments
        })

    } catch (err) {
        next(err)
    }


}


exports.getArticles = async (req, res, next) => {

    try {

        const {
            sort_by: sortBy,
            order,
            topic
        } = req.query;



        const articles = await selectArticles(sortBy, order, topic)

        res.status(200).send({
            articles
        })
    } catch (err) {
        next(err)
    }


}


exports.getArticleById = async (req, res, next) => {
    try {
        const {
            id
        } = req.params;



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
