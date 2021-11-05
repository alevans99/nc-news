const {
    selectArticleById,
    updateArticleById,
    selectArticles,
    selectCommentsByArticleId,
    insertCommentToArticleId
} = require("../models/articles-models")


//Serves all articles - filtered by queries
exports.getArticles = async (req, res, next) => {

    try {

        const {
            sort_by: sortBy,
            order,
            topic,
            limit,
            p: page
        } = req.query;


        const articles = await selectArticles(sortBy, order, topic, limit, page)

        res.status(200).send({
            articles
        })
    } catch (err) {
        next(err)
    }


}

//Serves single article by Id
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

//Updates number of votes for an article

exports.patchArticleById = async (req, res, next) => {
    try {
        const {
            id
        } = req.params;

        const {
            inc_votes: votesToChange
        } = req.body

        if (Object.keys(req.body).length > 1 || (Object.keys(req.body).length !== 0 && !req.body.hasOwnProperty("inc_votes"))) {

            await Promise.reject({
                status: 400,
                message: "Invalid Request"
            })
        }

        const article = await updateArticleById(id, votesToChange)

        res.status(200).send({
            article
        })

    } catch (err) {

        next(err)
    }

}

//Serves all comments for a single article

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

//Add a comment to a single article
exports.postCommentToArticleId = async (req, res, next) => {

    try {

        const {
            id
        } = req.params;

        const {
            username,
            body
        } = req.body

        //Check the body has the valid fields only
        if (Object.keys(req.body).length !== 2 ||
            (!req.body.hasOwnProperty('username') || !req.body.hasOwnProperty('body')) ||
            (typeof username !== 'string' || typeof body !== 'string' || isNaN(Number(id)) || !Number.isInteger(Number(id)))) {

            await Promise.reject({
                status: 400,
                message: "Invalid Request"
            })
        }

        const comment = await insertCommentToArticleId(id, username, body)

        res.status(201).send({
            comment
        })

    } catch (err) {
        next(err)
    }

}
