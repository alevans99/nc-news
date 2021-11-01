const {
    selectArticleById
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
