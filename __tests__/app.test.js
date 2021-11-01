const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');
const request = require("supertest");
const app = require("../app");


beforeEach(() => seed(testData));
afterAll(() => db.end());


describe('App.js', () => {


    describe('/api', () => {

        describe('GET', () => {

            it('Responds with code 200 and a status message when connected', () => {

                return request(app)
                    .get("/api")
                    .expect(200)
                    .then(({
                        body: {
                            message
                        }
                    }) => {
                        expect(message).toBe("Connected");
                    });

            });

            it("responds with status:404 when given a bad path", () => {
                return request(app)
                    .get("/badpath")
                    .expect(404)
                    .then(({
                        body
                    }) => {
                        expect(body.message).toBe("path not found");
                    });
            });


        });
    });


    describe('api/topics', () => {

        describe('GET', () => {

            it('Should return status code 200 and a list of all topics when successful', () => {

                return request(app)
                    .get("/api/topics")
                    .expect(200)
                    .then(({
                        body: {
                            topics
                        }
                    }) => {

                        expect(topics).toHaveLength(3);
                        topics.forEach((topic) => {
                            expect(Object.keys(topic)).toHaveLength(2)

                            expect(topic).toMatchObject({
                                slug: expect.any(String),
                                description: expect.any(String)
                            });
                        })


                    });

            });


        });


    });

    describe('api/articles', () => {


        describe('/api/articles/:article_id', () => {

            describe('GET', () => {


                it('Should respond with status 200 and the article object matching the ID', () => {

                    const articleId = 3
                    return request(app)
                        .get(`/api/articles/${articleId}`)
                        .expect(200)
                        .then(({
                            body: {
                                article
                            }
                        }) => {

                            expect(Object.keys(article)).toHaveLength(8)

                            expect(article).toMatchObject({
                                author: expect.any(String),
                                title: expect.any(String),
                                article_id: expect.any(Number),
                                body: expect.any(String),
                                topic: expect.any(String),
                                created_at: expect.any(String),
                                votes: expect.any(Number),
                                comment_count: expect.any(Number)
                            });

                            expect(article).toMatchObject({
                                title: 'Eight pug gifs that remind me of mitch',
                                topic: 'mitch',
                                author: 'icellusedkars',
                                body: 'some gifs',
                                created_at: '2020-11-03T00:00:00.000Z',
                                votes: 0,
                                comment_count: 2
                            })

                        });


                });

                it('Should return 404 Not Found when the article_id is valid type, but doesn\'t return an article', () => {

                    const articleId = 99999
                    return request(app)
                        .get(`/api/articles/${articleId}`)
                        .expect(404)
                        .then(({
                            body: {
                                message
                            }
                        }) => {

                            expect(message).toBe("Not Found")

                        });
                });


                it('Should return 400 Invalid Request when the article_id is an invalid type', () => {

                    const articleId = "wrong"
                    return request(app)
                        .get(`/api/articles/${articleId}`)
                        .expect(400)
                        .then(({
                            body: {
                                message
                            }
                        }) => {

                            expect(message).toBe("Invalid Request")

                        });
                });

            });

        });


    });

});
