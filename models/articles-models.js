const db = require('../db/connection.js');

//Return all articles from the DB
exports.selectArticles = async (
  sortBy = `created_at`,
  order = 'DESC',
  topic,
  limit = '10',
  page = '1'
) => {
  //stores optional params for the main DB query
  let queryParams = [];
  //stores optional params for the secondary DB query
  let totalArticlesQueryParams = [];

  //Contain the accepted criteria to check user input against
  const acceptedSortCriteria = [
    'author',
    'title',
    'article_id',
    'topic',
    'created_at',
    'votes',
    'comment_count',
  ];

  const acceptedOrderCriteria = ['ASC', 'DESC'];

  const { rows: allTopics } = await db.query(`SELECT * FROM topics`);

  const acceptedTopics = allTopics.map((topic) => {
    return topic.slug;
  });

  //Check sortBy and Order for invalid requests
  if (
    !acceptedSortCriteria.includes(sortBy) ||
    !acceptedOrderCriteria.includes(order.toUpperCase())
  ) {
    return Promise.reject({
      status: 400,
      message: 'Invalid Request',
    });
  }

  //Populate the topicQuery if the user has requested results filtered by topic
  let topicQuery = '';

  if (topic) {
    if (!acceptedTopics.includes(topic)) {
      return Promise.reject({
        status: 404,
        message: 'Not Found',
      });
    }
    topicQuery = `WHERE articles.topic = $1 `;
    queryParams.push(topic);
    totalArticlesQueryParams.push(topic);
  }

  //Check limit/page are integers
  if (
    isNaN(Number(limit)) ||
    !Number.isInteger(Number(limit)) ||
    isNaN(Number(page)) ||
    !Number.isInteger(Number(page))
  ) {
    return Promise.reject({
      status: 400,
      message: 'Invalid Request',
    });
  }

  //Setup limits and offsets based on default or user requests
  let limitQuery = `LIMIT $${queryParams.length + 1}`;
  queryParams.push(Number(limit));

  let pageOffset = Number(limit * (page - 1));
  let offsetQuery = `OFFSET $${queryParams.length + 1}`;
  queryParams.push(pageOffset);

  //Main DB query to get the article objects based on above filters
  const queryString = `SELECT articles.*, COUNT(comments.comment_id)::int AS comment_count FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id ${topicQuery} 
    GROUP BY articles.article_id ORDER BY ${sortBy} ${order.toUpperCase()} ${limitQuery} ${offsetQuery};`;

  const { rows: articles } = await db.query(queryString, queryParams);

  //Secondary request to get total number of articles disregarding limits/offsets
  const totalArticlesQuery = `SELECT * FROM articles ${topicQuery};`;

  const { rows: totalArticlesForRequest } = await db.query(
    totalArticlesQuery,
    totalArticlesQueryParams
  );

  return {
    articles,
    total_count: totalArticlesForRequest.length,
  };
};

//Return a single article from the DB
exports.selectArticleById = async (id) => {
  if (!Number.isInteger(Number(id))) {
    return Promise.reject({
      status: 400,
      message: 'Invalid Request',
    });
  }

  const queryString = `SELECT articles.*, COUNT(comments.comment_id)::int AS comment_count FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1
    GROUP BY articles.article_id;`;

  const {
    rows: [article],
  } = await db.query(queryString, [id]);

  if (!article) {
    return Promise.reject({
      status: 404,
      message: 'Not Found',
    });
  }

  return article;
};

//Update the number of votes for a single article and return it
exports.updateArticleById = async (id, votesToChange) => {
  if (!Number.isInteger(Number(id))) {
    return Promise.reject({
      status: 400,
      message: 'Invalid Request',
    });
  }

  //Only update if a request body has been provided
  if (votesToChange) {
    //Only allow Integers to be passed to the DB
    if (!Number.isInteger(Number(votesToChange))) {
      return Promise.reject({
        status: 400,
        message: 'Invalid Request',
      });
    }

    await db.query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2;`,
      [votesToChange, id]
    );
  }

  const queryString = `SELECT articles.*, COUNT(comments.comment_id)::int AS comment_count FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1
    GROUP BY articles.article_id;`;

  const {
    rows: [article],
  } = await db.query(queryString, [id]);

  if (!article) {
    return Promise.reject({
      status: 404,
      message: 'Not Found',
    });
  }

  return article;
};

//Return all comments for a single article
exports.selectCommentsByArticleId = async (id, limit = '10', page = '1') => {
  //Check limit/page are integers
  if (
    isNaN(Number(limit)) ||
    !Number.isInteger(Number(limit)) ||
    isNaN(Number(page)) ||
    !Number.isInteger(Number(page)) ||
    isNaN(Number(id)) ||
    !Number.isInteger(Number(id))
  ) {
    return Promise.reject({
      status: 400,
      message: 'Invalid Request',
    });
  }

  //Collect params needed for the DB query
  const queryParams = [id];

  //Setup limits and offsets based on default or user requests
  let limitQuery = `LIMIT $${queryParams.length + 1}`;
  queryParams.push(Number(limit));

  let pageOffset = Number(limit * (page - 1));
  let offsetQuery = `OFFSET $${queryParams.length + 1}`;
  queryParams.push(pageOffset);

  //Check article exists
  const {
    rows: [requestedArticle],
  } = await db.query(`SELECT * FROM articles WHERE article_id = $1`, [id]);

  if (!requestedArticle) {
    return Promise.reject({
      status: 404,
      message: 'Not Found',
    });
  }

  const { rows: comments } = await db.query(
    `SELECT * FROM comments WHERE article_id = $1 ${limitQuery} ${offsetQuery};`,
    queryParams
  );

  return comments;
};

//Add a new comment for a single article
exports.insertCommentToArticleId = async (id, username, body) => {
  //Check article exists
  const { rows: validArticles } = await db.query(
    `SELECT * FROM articles WHERE article_id = $1;`,
    [id]
  );

  if (validArticles.length !== 1) {
    return Promise.reject({
      status: 404,
      message: 'Not Found',
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

  const createdAt = new Date(Date.now());

  const {
    rows: [comment],
  } = await db.query(
    `INSERT INTO comments (author, body, created_at, article_id)
    VALUES ($1, $2, $3, $4) RETURNING *;`,
    [username, body, createdAt, id]
  );

  return comment;
};

exports.insertArticle = async (author, title, body, topic) => {
  //Check the body has the valid fields only
  if (
    !author ||
    !title ||
    !body ||
    !topic ||
    typeof author !== 'string' ||
    typeof title !== 'string' ||
    typeof body !== 'string' ||
    typeof topic !== 'string'
  ) {
    await Promise.reject({
      status: 400,
      message: 'Invalid Request',
    });
  }

  //Check the user exists
  const { rows: validUsers } = await db.query(
    `SELECT username FROM users WHERE username = $1;`,
    [author]
  );

  if (validUsers.length !== 1) {
    return Promise.reject({
      status: 404,
      message: 'Not Found',
    });
  }

  const createdAt = new Date(Date.now());

  //Create the new article
  const {
    rows: [newArticle],
  } = await db.query(
    `INSERT INTO articles (title,
        body, topic, author, created_at)
    VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
    [title, body, topic, author, createdAt]
  );

  //Fetch the new comment with the full details
  const queryString = `SELECT articles.*, COUNT(comments.comment_id)::int AS comment_count FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1
    GROUP BY articles.article_id;`;

  const {
    rows: [article],
  } = await db.query(queryString, [newArticle['article_id']]);

  return article;
};

exports.removeArticleById = async (id) => {
  //Check if ID is valid
  if (!Number.isInteger(Number(id)) || isNaN(Number(id))) {
    return Promise.reject({
      status: 400,
      message: 'Invalid Request',
    });
  }

  const { rows: deletedArticle } = await db.query(
    `DELETE FROM articles WHERE article_id = $1 RETURNING *;`,
    [id]
  );

  if (deletedArticle.length === 0 || !deletedArticle) {
    return Promise.reject({
      status: 404,
      message: 'Not Found',
    });
  }

  return;
};
