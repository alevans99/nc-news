const db = require('../db/connection.js');


exports.selectTopics = async () => {

    const {
        rows
    } = await db.query(`SELECT * FROM topics;`)

    return rows

}
