const db = require('../db/connection.js');


exports.selectArticleById = async (id) => {

    if (!Number.isInteger(Number(id))) {
        return Promise.reject({
            status: 400,
            message: "Invalid Request"
        })
    }

    const queries = [
        db.query(`SELECT * FROM articles WHERE article_id = $1;`, [id]),
        db.query(`SELECT COUNT(comment_id) FROM comments WHERE article_id = $1`, [id])
    ]

    const [{
        rows: [article]
    }, {
        rows: [{
            count
        }]
    }] = await Promise.all(queries)

    if (!article) {
        return Promise.reject({
            status: 404,
            message: "Not Found"
        })
    }

    article['comment_count'] = Number(count)

    return article

}


exports.updateArticleById = async (id, changeVotes) => {

    if (!Number.isInteger(Number(id)) || !Number.isInteger(Number(changeVotes))) {
        return Promise.reject({
            status: 400,
            message: "Invalid Request"
        })
    }


    const queries = [
        db.query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`, [changeVotes, id]),
        db.query(`SELECT COUNT(comment_id) FROM comments WHERE article_id = $1`, [id])
    ]

    const [{
        rows: [article]
    }, {
        rows: [{
            count
        }]
    }] = await Promise.all(queries)

    if (!article) {
        return Promise.reject({
            status: 404,
            message: "Not Found"
        })
    }

    article['comment_count'] = Number(count)

    return article


}
