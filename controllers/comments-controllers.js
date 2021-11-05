const {
    removeComment,
    updateComment
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

exports.patchComment = async (req, res, next) => {
    try {
        const {
            comment_id: id
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

        const comment = await updateComment(id, votesToChange)

        res.status(200).send({
            comment
        })

    } catch (err) {

        next(err)
    }

}
