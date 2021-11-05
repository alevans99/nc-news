const db = require('../db/connection.js');


exports.selectTopics = async () => {

    const {
        rows
    } = await db.query(`SELECT * FROM topics;`)

    return rows

}

exports.insertTopic = async (slug, description) => {


    if (typeof slug !== 'string' || typeof description !== 'string') {
        return Promise.reject({
            status: 400,
            message: "Invalid Request"
        })
    }

    const {
        rows: [topic]
    } = await db.query(`INSERT INTO topics (slug, description) VALUES ($1, $2) RETURNING *;`, [slug, description])

    return topic

}
