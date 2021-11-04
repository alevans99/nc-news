const db = require('../db/connection.js');

//Return all articles from the DB
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

    const {
        rows: allTopics
    } = await db.query(`SELECT * FROM topics`)

    const acceptedTopics = allTopics.map((topic) => {
        return topic.slug
    })

    if (!acceptedSortCriteria.includes(sortBy) || !acceptedOrderCriteria.includes(order.toUpperCase())) {

        return Promise.reject({
            status: 400,
            message: "Invalid Request"
        })

    }
    let topicQuery = ""
    let topicParams = []


    if (topic) {
        if (!acceptedTopics.includes(topic)) {
            return Promise.reject({
                status: 404,
                message: "Not Found"
            })
        }
        topicQuery = `WHERE articles.topic = $1 `
        topicParams.push(topic)
    }


    const queryString = `SELECT articles.*, COUNT(comments.comment_id)::int AS comment_count FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id ${topicQuery} 
    GROUP BY articles.article_id ORDER BY articles.${sortBy} ${order.toUpperCase()};`



    const {
        rows: articles
    } = await db.query(queryString, topicParams)



    // if (articles.length === 0 || !articles) {

    //     return Promise.reject({
    //         status: 404,
    //         message: "Not Found"
    //     })
    // }

    return articles

}

//Return a single article from the DB
exports.selectArticleById = async (id) => {

    if (!Number.isInteger(Number(id))) {
        return Promise.reject({
            status: 400,
            message: "Invalid Request"
        })
    }

    const queryString = `SELECT articles.*, COUNT(comments.comment_id)::int AS comment_count FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1
    GROUP BY articles.article_id;`

    const {
        rows: [article]
    } = await db.query(queryString, [id])


    if (!article) {
        return Promise.reject({
            status: 404,
            message: "Not Found"
        })
    }

    return article

}

//Update the number of votes for a single article and return it
exports.updateArticleById = async (id, changeVotes) => {



    if (!Number.isInteger(Number(id)) || !Number.isInteger(Number(changeVotes))) {
        return Promise.reject({
            status: 400,
            message: "Invalid Request"
        })
    }

    await db.query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2;`, [changeVotes, id])

    const queryString = `SELECT articles.*, COUNT(comments.comment_id)::int AS comment_count FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1
    GROUP BY articles.article_id;`

    const {
        rows: [article]
    } = await db.query(queryString, [id])

    if (!article) {
        return Promise.reject({
            status: 404,
            message: "Not Found"
        })
    }


    return article


}

//Return all comments for a single article
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


//Add a new comment for a single article
exports.insertCommentToArticleId = async (id, username, body) => {

    const {
        rows: validArticleCheck
    } = await db.query(`SELECT * FROM articles WHERE article_id = $1;`, [id])

    if (validArticleCheck.length !== 1) {
        return Promise.reject({
            status: 404,
            message: "Not Found"
        })
    }


    const {
        rows: validUsers
    } = await db.query(`SELECT username FROM users WHERE username = $1;`, [username])

    if (!Number.isInteger(Number(id)) || validUsers.length !== 1) {
        return Promise.reject({
            status: 400,
            message: "Invalid Request"
        })
    }

    const createdAt = new Date(Date.now())

    const {
        rows: [comment]
    } = await db.query(`INSERT INTO comments (author, body, created_at, article_id)
    VALUES ($1, $2, $3, $4) RETURNING *;`, [username, body, createdAt, id])


    return comment
}
