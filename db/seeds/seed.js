const db = require("../connection");
const format = require("pg-format")

const seed = (data) => {
  const {
    articleData,
    commentData,
    topicData,
    userData
  } = data;


  return db.query('DROP TABLE IF EXISTS comments;')
    .then(() => {
      return db.query('DROP TABLE IF EXISTS articles;')
    })
    .then(() => {
      return db.query('DROP TABLE IF EXISTS topics;')
    })
    .then(() => {
      return db.query('DROP TABLE IF EXISTS users;')
    })
    .then(() => {
      return db.query(
        `CREATE TABLE users (
        username VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        avatar_url VARCHAR NOT NULL
      );`)
    })
    .then(() => {

      const usersToInsert = userData.map(({
        username,
        name,
        avatar_url
      }) => {
        return [username, name, avatar_url];
      })

      const insertUsers = format(`INSERT INTO users (username, name, avatar_url) VALUES %L;`,
        usersToInsert);

      return db.query(insertUsers)

    })
    .then(() => {
      return db.query(
        `CREATE TABLE topics (
        slug VARCHAR(255) PRIMARY KEY UNIQUE NOT NULL,
        description VARCHAR(255) NOT NULL
      );`)

    })
    .then(() => {

      const topicsToInsert = topicData.map(({
        slug,
        description
      }) => {
        return [slug, description];
      })

      const insertTopics = format(`INSERT INTO topics (slug, description) VALUES %L;`,
        topicsToInsert);
      return db.query(insertTopics)

    })
    .then(() => {

      return db.query(
        `CREATE TABLE articles (
        article_id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        body TEXT NOT NULL,
        votes INTEGER DEFAULT 0,
        topic VARCHAR(255) NOT NULL REFERENCES topics(slug),
        author VARCHAR(255) NOT NULL REFERENCES users(username),
        created_at TIMESTAMP NOT NULL
      );`)

    })
    .then(() => {

      const articlesToInsert = articleData.map(({
        title,
        body,
        votes,
        topic,
        author,
        created_at
      }) => {
        return [title,
          body,
          votes,
          topic,
          author,
          created_at
        ];
      })

      const insertArticles = format(`INSERT INTO articles (title,
        body, votes, topic, author, created_at) VALUES %L RETURNING *;`, articlesToInsert);

      return db.query(insertArticles)

    })
    .then(() => {

      return db.query(
        `CREATE TABLE comments (
        comment_id SERIAL PRIMARY KEY,
        author VARCHAR(255) NOT NULL REFERENCES users(username),
        article_id INTEGER NOT NULL REFERENCES articles(article_id) ON DELETE CASCADE,
        votes INTEGER DEFAULT 0,
        created_at DATE NOT NULL,
        body VARCHAR NOT NULL
      );`)

    })
    .then(() => {

      const commentsToInsert = commentData.map(({
        author,
        article_id,
        votes,
        created_at,
        body
      }) => {
        return [author,
          article_id,
          votes,
          created_at,
          body
        ];
      })

      const insertComments = format(`INSERT INTO comments (author,
        article_id, votes, created_at, body) VALUES %L;`, commentsToInsert);

      return db.query(insertComments)
    })
    .catch((err) => {
      console.log(err)
    })


};

module.exports = seed;
