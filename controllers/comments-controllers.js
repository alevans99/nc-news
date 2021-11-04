const {
    removeComment
} = require("../models/comments-models")


exports.deleteComment = async (req, res, next) => {

    try {
        const {
            comment_id: id
        } = req.params;

        await removeComment(id)

        res.status(204).send()

    } catch (err) {
        next(err)
    }



}
