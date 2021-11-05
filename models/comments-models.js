const db = require('../db/connection.js');


exports.removeComment = async (id) => {

    //Check if ID is valid
    if (!Number.isInteger(Number(id))) {
        return Promise.reject({
            status: 400,
            message: "Invalid Request"
        })
    }


    //Check if comment exists

    const {
        rows: comments
    } = await db.query(`SELECT * FROM comments WHERE comment_id = $1;`, [id])

    if (!comments || comments.length === 0) {
        return Promise.reject({
            status: 404,
            message: "Not Found"
        })
    }

    const removedComment = await db.query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [id])

    return removedComment

}


//Update the number of votes for a single comment and return it
exports.updateComment = async (id, votesToChange) => {


    if (!Number.isInteger(Number(id))) {
        return Promise.reject({
            status: 400,
            message: "Invalid Request"
        })
    }

    //Only update if a request body has been provided
    if (votesToChange) {

        //Only allow Integers to be passed to the DB
        if (!Number.isInteger(Number(votesToChange))) {
            return Promise.reject({
                status: 400,
                message: "Invalid Request"
            })
        }

        await db.query(`UPDATE comments SET votes = votes + $1 WHERE comment_id = $2;`, [votesToChange, id])
    }


    const queryString = `SELECT * FROM comments WHERE comment_id = $1`

    const {
        rows: [comment]
    } = await db.query(queryString, [id])

    if (!comment) {
        return Promise.reject({
            status: 404,
            message: "Not Found"
        })
    }


    return comment


}
