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
