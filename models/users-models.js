const db = require('../db/connection.js');

exports.selectUsers = async () => {
  const { rows: users } = await db.query(`SELECT * FROM users;`);

  if ((users.length === 0) | !users) {
    return Promise.reject({
      status: 404,
      message: 'Not Found',
    });
  }

  const usernameArray = users.map((user) => {
    return {
      username: user.username,
    };
  });

  return usernameArray;
};

exports.selectUserByUsername = async (username) => {
  //Check username is correct format
  if (typeof username !== 'string') {
    await Promise.reject({
      status: 400,
      message: 'Invalid Request',
    });
  }

  const { rows: user } = await db.query(
    `SELECT * FROM users WHERE users.username = $1;`,
    [username]
  );

  if ((user.length === 0) | !user) {
    return Promise.reject({
      status: 404,
      message: 'Not Found',
    });
  }

  return user[0];
};

//Return all comments for a single article
exports.selectCommentsByUsername = async (
  username,
  limit = '10',
  page = '1'
) => {
  //Check username is correct format
  if (typeof username !== 'string') {
    await Promise.reject({
      status: 400,
      message: 'Invalid Request',
    });
  }

  //Check the user exists
  const { rows: validUsers } = await db.query(
    `SELECT username FROM users WHERE username = $1;`,
    [username]
  );

  if (validUsers.length !== 1) {
    return Promise.reject({
      status: 404,
      message: 'Not Found',
    });
  }

  //Collect params needed for the DB query
  const queryParams = [username];

  //Setup limits and offsets based on default or user requests
  let limitQuery = `LIMIT $${queryParams.length + 1}`;
  queryParams.push(Number(limit));

  let pageOffset = Number(limit * (page - 1));
  let offsetQuery = `OFFSET $${queryParams.length + 1}`;
  queryParams.push(pageOffset);

  const { rows: comments } = await db.query(
    `SELECT * FROM comments WHERE author = $1 ORDER BY created_at DESC ${limitQuery} ${offsetQuery};`,
    queryParams
  );

  //Secondary request to get total number of comments disregarding limits/offsets
  const totalCommentsQuery = `SELECT * FROM comments WHERE author = $1;`;

  const { rows: totalCommentsForRequest } = await db.query(totalCommentsQuery, [
    username,
  ]);

  return {
    comments,
    total_count: totalCommentsForRequest.length,
  };
};

//Return a single article from the DB
exports.selectArticlesByUsername = async (
  username,
  limit = '10',
  page = '1'
) => {
  //Check username is correct format
  if (typeof username !== 'string') {
    await Promise.reject({
      status: 400,
      message: 'Invalid Request',
    });
  }

  //Check the user exists
  const { rows: validUsers } = await db.query(
    `SELECT username FROM users WHERE username = $1;`,
    [username]
  );

  if (validUsers.length !== 1) {
    return Promise.reject({
      status: 404,
      message: 'Not Found',
    });
  }

  //Collect params needed for the DB query
  const queryParams = [username];

  //Setup limits and offsets based on default or user requests
  let limitQuery = `LIMIT $${queryParams.length + 1}`;
  queryParams.push(Number(limit));

  let pageOffset = Number(limit * (page - 1));
  let offsetQuery = `OFFSET $${queryParams.length + 1}`;
  queryParams.push(pageOffset);

  //Create the query

  const queryString = `SELECT articles.*, COUNT(comments.comment_id)::int AS comment_count FROM articles 
  LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.author = $1
  GROUP BY articles.article_id ORDER BY created_at DESC ${limitQuery} ${offsetQuery};`;

  const { rows: articles } = await db.query(queryString, queryParams);

  //Secondary request to get total number of comments disregarding limits/offsets
  const totalArticlesQuery = `SELECT * FROM articles WHERE author = $1;`;

  const { rows: totalArticlesForRequest } = await db.query(totalArticlesQuery, [
    username,
  ]);

  return {
    articles,
    total_count: totalArticlesForRequest.length,
  };
};
