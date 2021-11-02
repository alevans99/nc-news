const db = require('../db/connection.js');


exports.selectCommentsByArticleId = async (id) => {

    if (!Number.isInteger(Number(id))) {
        return Promise.reject({
            status: 400,
            message: "Invalid Request"
        })
    }

    const {
        rows: comments
    } = await db.query(`SELECT * FROM comments WHERE article_id = $1;`, [id])

    if (!comments || comments.length === 0) {
        return Promise.reject({
            status: 404,
            message: "Not Found"
        })
    }

    return comments


}



exports.selectArticles = async (sortBy = `created_at`, order = 'DESC', topic) => {


    const acceptedSortCriteria = [
        'author',
        'title',
        'article_id',
        'topic',
        'created_at',
        'votes',
        'comment_count'
    ]

    const acceptedOrderCriteria = [
        'ASC',
        'DESC'
    ]


    if (!acceptedSortCriteria.includes(sortBy) || !acceptedOrderCriteria.includes(order.toUpperCase())) {

        return Promise.reject({
            status: 400,
            message: "Invalid Request"
        })

    }
    let topicQuery = ""
    let topicParams = []

    if (topic) {
        topicQuery = `WHERE articles.topic = $1 `
        topicParams.push(topic)
    }

    const queryString = `SELECT articles.*, COUNT(comments.comment_id)::int AS comment_count FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id ${topicQuery} 
    GROUP BY articles.article_id ORDER BY articles.${sortBy} ${order.toUpperCase()};`




    const {
        rows: articles
    } = await db.query(queryString, topicParams)



    if (articles.length === 0 || !articles) {
        return Promise.reject({
            status: 404,
            message: "Not Found"
        })
    }

    return articles




}

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
