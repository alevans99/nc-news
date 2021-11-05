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


exports.selectUserByUsername = async (username) => {

    //Check username is correct format
    if (typeof username !== 'string') {
        await Promise.reject({
            status: 400,
            message: "Invalid Request"
        })
    }


    const {
        rows: user
    } = await db.query(`SELECT * FROM users WHERE users.username = $1;`, [username])

    if (user.length === 0 | !user) {
        return Promise.reject({
            status: 404,
            message: "Not Found"
        })
    }

    return user[0]
}
