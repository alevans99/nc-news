const db = require('../db/connection.js');


exports.selectUsers = async () => {

    const {
        rows: users
    } = await db.query(`SELECT * FROM users;`)

    if (users.length === 0 | !users) {
        return Promise.reject({
            status: 404,
            message: "Not Found"
        })
    }

    const usernameArray = users.map((user) => {
        return {
            username: user.username
        }
    })

    return usernameArray

}
