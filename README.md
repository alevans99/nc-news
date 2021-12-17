# NC News API

NC News is a social news aggregation, web content rating, and discussion website.

NC News has articles which are divided into topics. Each article has user curated ratings and can be up or down voted using the API. Users can also add comments about an article, as well as submitting their own articles and creating new topics.

The NC News API provides a backend for a Reddit-like news service. The API serves articles, comments, users and topics as well as updating votes and comments.

## About the Project

NC News is the combination of two projects created during my training as a Junior Full-Stack Developer. The projects were split into two separate sprints, firstly the backend for the app was created to provide a RESTful API to allow the website functionality.

The second sprint added a frontend to the project using React.

You can visit the frontend project here: [https://github.com/alevans99/nc-news-fe](https://github.com/alevans99/nc-news-fe)

Visit a hosted version of the website here: [https://nc-news-ae.netlify.app](https://nc-news-ae.netlify.app)

## Setup

To deploy this project on your local machine follow the instructions below.

Clone the project:

```bash
  git clone https://github.com/alevans99/nc-news.git
```

Install dependencies:

```bash
  npm i
```

## Environment Variables

The project required two '.env' files to be created in the root folder:

`.env.test`

`.env.development`

Into each, add
`PGDATABASE=<database_name_here>` with the correct database name for that environment (see /db/setup.sql for the database names).

## Create and Seed Local Databases

Create the test and development databases:

```bash
  npm run setup-dbs
```

Seed the database:

```bash
  npm run seed
```

## Test

You can test the functionality of the different endpoints by running:

```bash
  npm test
```

## Deploy

To use the API on your localhost, run the following to connect to port 9090:

```bash
  npm run start
```

## API Reference

### Get all endpoints as JSON

```http
  GET /api
```

### Get all topics

```http
  GET /api/topics
```

### Get all articles

```http
  GET /api/articles
```

| Query     | Options                                                                          | Description                                                       |
| :-------- | :------------------------------------------------------------------------------- | :---------------------------------------------------------------- |
| `sort_by` | `author`, `topic`, `title`, `article_id`, `created_at`, `votes`, `comment_count` | **Optional**. Sorts results by requested value - defaults to date |
| `order`   | `asc`, `desc`                                                                    | **Optional**. Defaults to descending                              |
| `topic`   | `name of the topic`                                                              | **Optional**. Filters results by the topic requested              |

### Get article by id

```http
  GET /api/articles/:article_id
```

| Parameter    | Type      | Description                                                 |
| :----------- | :-------- | :---------------------------------------------------------- |
| `article_id` | `Integer` | **Required** Provides the article matching the requested Id |

### Update the number of votes for an article

```http
  PATCH /api/articles/:article_id
```

| Parameter    | Type      | Description                                                |
| :----------- | :-------- | :--------------------------------------------------------- |
| `article_id` | `Integer` | **Required** Updates the article matching the requested Id |

| JSON Body   | Type      | Description                                                                                                                                                             |
| :---------- | :-------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `inc_votes` | `Integer` | **Required** E.g. `{ inc_votes : 1 }` increments the current article's vote property by 1, `{ inc_votes : -100 }` decrements the current article's vote property by 100 |

### Get comments by article id

```http
  GET /api/articles/:article_id/comments
```

| Parameter    | Type      | Description                                                              |
| :----------- | :-------- | :----------------------------------------------------------------------- |
| `article_id` | `Integer` | **Required** Provides comments for the article matching the requested Id |

### Post a new comment for an article

```http
  POST /api/articles/:article_id/comments
```

| Parameter    | Type      | Description                                                           |
| :----------- | :-------- | :-------------------------------------------------------------------- |
| `article_id` | `Integer` | **Required** Post a comment for the article matching the requested Id |

| JSON Body  | Type     | Description                              |
| :--------- | :------- | :--------------------------------------- |
| `username` | `String` | **Required** Must match an existing user |
| `body`     | `String` | **Required** Comment text                |

### Delete a comment

```http
  DELETE /api/comments/:comment_id
```

| Parameter    | Type      | Description                                                |
| :----------- | :-------- | :--------------------------------------------------------- |
| `comment_id` | `Integer` | **Required** Removed the comment matching the requested Id |
