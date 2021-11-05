const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');
const request = require("supertest");
const app = require("../app");
const endpointsData = require("../endpoints.json")

beforeEach(() => seed(testData));
afterAll(() => db.end());


describe('App.js', () => {

    describe('/', () => {

        describe('GET', () => {
            it('should send a connected message and 200', () => {

                return request(app)
                    .get("/")
                    .expect(200)
                    .then(({
                        body: {
                            message
                        }
                    }) => {

                        expect(message).toBe("Connected - use /api to view possible endpoints")
                    })

            });

            describe('POST/PATCH/DELETE', () => {

                it('should return method not allowed', () => {

                    return request(app)
                        .post(`/`)
                        .expect(405)
                        .then(({
                            body: {
                                message
                            }
                        }) => {

                            expect(message).toEqual("Method Not Allowed")
                        });


                });
            });
        });


    });


    describe('/api', () => {

        describe('GET', () => {

            it('Responds with code 200 and a JSON message describing available endpoints when connected', () => {

                return request(app)
                    .get("/api")
                    .expect(200)
                    .then(({
                        body: {
                            endpoints
                        }
                    }) => {
                        expect(endpoints).toEqual(endpointsData);

                        expect(endpoints).toMatchObject({
                            "GET /api": expect.any(Object),
                            "GET /api/topics": expect.any(Object),
                            "GET /api/articles": expect.any(Object),
                            "GET /api/articles/:article_id": expect.any(Object),
                            "PATCH /api/articles/:article_id": expect.any(Object),
                            "GET /api/articles/:article_id/comments": expect.any(Object),
                            "POST /api/articles/:article_id/comments": expect.any(Object),
                            "DELETE /api/comments/:comment_id": expect.any(Object)
                        })
                    });

            });

            it("responds with status:404 when given a bad path", () => {
                return request(app)
                    .get("/api/badpath")
                    .expect(404)
                    .then(({
                        body
                    }) => {
                        expect(body.message).toBe("path not found");
                    });
            });


        });


        describe('POST/PATCH/DELETE', () => {

            it('should return method not allowed', () => {


                return request(app)
                    .post(`/api`)
                    .expect(405)
                    .then(({
                        body: {
                            message
                        }
                    }) => {

                        expect(message).toEqual("Method Not Allowed")
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


        describe('POST', () => {


            it('Should respond with 201 and the new topic object when successful', () => {

                return request(app)
                    .post("/api/topics")
                    .send({
                        slug: "test topic",
                        description: "A topic to use for a test"
                    })
                    .expect(201)
                    .then(({
                        body: {
                            topic
                        }
                    }) => {


                        expect(Object.keys(topic)).toHaveLength(2)

                        expect(topic).toMatchObject({
                            slug: expect.any(String),
                            description: expect.any(String)
                        });

                        expect(topic).toMatchObject({
                            slug: "test topic",
                            description: "A topic to use for a test"
                        })



                    });
            });



            it('Should respond with 400 if the topic is not unique', () => {

                return request(app)
                    .post("/api/topics")
                    .send({
                        slug: "paper",
                        description: "An incorrect topic"
                    })
                    .expect(400)
                    .then(({
                        body: {
                            message
                        }
                    }) => {

                        expect(message).toBe("Invalid Request")

                    });
            });


            it('Should respond with 400 if an incorrect value type is given', () => {

                return request(app)
                    .post("/api/topics")
                    .send({
                        slug: 36,
                        description: "An incorrect topic"
                    })
                    .expect(400)
                    .then(({
                        body: {
                            message
                        }
                    }) => {

                        expect(message).toBe("Invalid Request")

                    });
            });

            it('Should respond with 400 if one or more required values are not included in the body', () => {

                return request(app)
                    .post("/api/topics")
                    .send({
                        slug: "unique",

                    })
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

        describe('PATCH/DELETE', () => {

            it('should return method not allowed', () => {


                return request(app)
                    .delete(`/api/topics`)
                    .expect(405)
                    .then(({
                        body: {
                            message
                        }
                    }) => {

                        expect(message).toEqual("Method Not Allowed")
                    });


            });

        });


    });

    describe('api/articles', () => {


        describe('GET', () => {

            it('should return an array of articles with status 200 when successful', () => {

                return request(app)
                    .get(`/api/articles`)
                    .expect(200)
                    .then(({
                        body: {
                            articles
                        }
                    }) => {

                        expect(articles).toHaveLength(10)

                        articles.forEach((article) => {

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

                        })

                    });


            });

            it('should return a total_count property which provides the total number of articles disregarding limits', () => {

                return request(app)
                    .get(`/api/articles?limit=2`)
                    .expect(200)
                    .then(({
                        body: {
                            total_count
                        }
                    }) => {

                        expect(total_count).toBe(12)

                    });

            });


            it('should return a total_count property which provides the total number of articles disregarding limits', () => {

                return request(app)
                    .get(`/api/articles?topic=paper`)
                    .expect(200)
                    .then(({
                        body: {
                            total_count
                        }
                    }) => {

                        expect(total_count).toBe(0)

                    });

            });

            it('should sort by date by default', () => {

                return request(app)
                    .get(`/api/articles`)
                    .expect(200)
                    .then(({
                        body: {
                            articles
                        }
                    }) => {

                        expect(articles).toHaveLength(10)
                        expect(articles).toBeSortedBy('created_at', {
                            descending: true
                        })
                    });

            });


            it('Should take a sort_by query that allows choice of sorting column', () => {

                return request(app)
                    .get(`/api/articles?sort_by=author`)
                    .expect(200)
                    .then(({
                        body: {
                            articles
                        }
                    }) => {

                        expect(articles).toHaveLength(10)
                        expect(articles).toBeSortedBy('author', {
                            descending: true
                        })
                    });


            });

            it('Should take a order query that allows choice of sorting direction', () => {

                return request(app)
                    .get(`/api/articles?sort_by=title&order=asc`)
                    .expect(200)
                    .then(({
                        body: {
                            articles
                        }
                    }) => {

                        expect(articles).toHaveLength(10)
                        expect(articles).toBeSortedBy('title')
                    });


            });

            it('Should take a topic query that allows search by topic', () => {

                return request(app)
                    .get(`/api/articles?sort_by=title&order=asc&topic=cats`)
                    .expect(200)
                    .then(({
                        body: {
                            articles
                        }
                    }) => {

                        const filteredArticles = articles.filter((article) => {
                            return article.topic === 'cats'
                        })

                        expect(articles).toEqual(filteredArticles.slice(0, 10))
                    });


            });




            it('Should take a limit query that allows you to limit the number of results', () => {

                return request(app)
                    .get(`/api/articles?limit=2`)
                    .expect(200)
                    .then(({
                        body: {
                            articles
                        }
                    }) => {

                        expect(articles).toHaveLength(2)
                    });


            });

            it('The number of results should be limited to 10 by default', () => {

                return request(app)
                    .get(`/api/articles`)
                    .expect(200)
                    .then(({
                        body: {
                            articles
                        }
                    }) => {

                        expect(articles).toHaveLength(10)
                    });


            });

            it('Larger limits should return the total number is a higher number is requested', () => {

                return request(app)
                    .get(`/api/articles?limit=20`)
                    .expect(200)
                    .then(({
                        body: {
                            articles
                        }
                    }) => {

                        expect(articles).toHaveLength(12)
                    });


            });

            it('Should return 400 if an invalid limit type is provided', () => {

                return request(app)
                    .get(`/api/articles?limit=wrong`)
                    .expect(400)
                    .then(({
                        body: {
                            message
                        }
                    }) => {

                        expect(message).toBe("Invalid Request")
                    });


            });

            it('Should take a p query that allows you to specify which page you want to display', () => {

                return request(app)
                    .get(`/api/articles?limit=2&p=3`)
                    .expect(200)
                    .then(({
                        body: {
                            articles
                        }
                    }) => {

                        expect(articles).toHaveLength(2)
                        expect(articles[0]).toMatchObject({
                            article_id: 5,
                            title: 'UNCOVERED: catspiracy to bring down democracy',
                            body: 'Bastet walks amongst us, and the cats are taking arms!',
                            votes: 0,
                            topic: 'cats',
                            author: 'rogersop',
                            created_at: '2020-08-03T13:14:00.000Z',
                            comment_count: 2
                        })
                        expect(articles[1]).toMatchObject({
                            article_id: 1,
                            title: 'Living in the shadow of a great man',
                            body: 'I find this existence challenging',
                            votes: 100,
                            topic: 'mitch',
                            author: 'butter_bridge',
                            created_at: '2020-07-09T20:11:00.000Z',
                            comment_count: 11
                        })

                    });


            });

            it('Should take a p query that allows you to specify which page you want to display', () => {

                return request(app)
                    .get(`/api/articles?p=2`)
                    .expect(200)
                    .then(({
                        body: {
                            articles
                        }
                    }) => {

                        expect(articles).toHaveLength(2)
                    });

            });

            it('Should return 400 when an invalid page type is provided', () => {

                return request(app)
                    .get(`/api/articles?p=wrong`)
                    .expect(400)
                    .then(({
                        body: {
                            message
                        }
                    }) => {

                        expect(message).toBe("Invalid Request")
                    });

            });


            it('Should return 200 and an empty array when a valid topic yields no results', () => {

                return request(app)
                    .get(`/api/articles?topic=paper`)
                    .expect(200)
                    .then(({
                        body: {
                            articles
                        }
                    }) => {

                        expect(articles).toEqual([])
                    });


            });

            it('Should return 404 and a topic doesn\'t exist', () => {

                return request(app)
                    .get(`/api/articles?topic=notatopic`)
                    .expect(404)
                    .then(({
                        body: {
                            message
                        }
                    }) => {

                        expect(message).toEqual("Not Found")
                    });


            });

            it('Should return 404 not found when search query has no results', () => {

                return request(app)
                    .get(`/api/articles?sort_by=title&order=asc&topic=wrong`)
                    .expect(404)
                    .then(({
                        body: {
                            message
                        }
                    }) => {

                        expect(message).toEqual("Not Found")
                    });


            });

            it('Should reject sort queries which are not valid columns with status 400', () => {

                return request(app)
                    .get(`/api/articles?sort_by=wrong&order=asc`)
                    .expect(400)
                    .then(({
                        body: {
                            message
                        }
                    }) => {

                        expect(message).toBe("Invalid Request")

                    });


            });

            it('Should reject order queries which are not valid columns with status 400', () => {

                return request(app)
                    .get(`/api/articles?sort_by=title&order=wrong`)
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


        describe('POST', () => {

            it('should return 201 and the newly added article when successful', () => {

                return request(app)
                    .post(`/api/articles`)
                    .send({

                        title: 'Another cat article',
                        topic: 'cats',
                        author: 'icellusedkars',
                        body: 'some images'

                    })
                    .expect(201)
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
                            article_id: 13,
                            title: 'Another cat article',
                            topic: 'cats',
                            author: 'icellusedkars',
                            body: 'some images',
                            created_at: expect.any(String),
                            votes: 0,
                            comment_count: 0
                        })

                    });


            });


            it('should return 400 if invalid body provided ', () => {

                return request(app)
                    .post(`/api/articles`)
                    .send({

                        thetitle: 'Another cat article',
                        topic: 'cats',
                        author: 'icellusedkars',
                        body: 'some images'

                    })
                    .expect(400)
                    .then(({
                        body: {
                            message
                        }
                    }) => {

                        expect(message).toBe("Invalid Request")

                    });


            });

            it('should return 400 if no body provided ', () => {

                return request(app)
                    .post(`/api/articles`)
                    .send({

                        title: 'Another cat article',
                        topic: 3,
                        author: 'icellusedkars',
                        body: 'some images'

                    })
                    .expect(400)
                    .then(({
                        body: {
                            message
                        }
                    }) => {

                        expect(message).toBe("Invalid Request")

                    });
            });


            it('should return 404 if a username is not found, but provided in the valid format', () => {

                return request(app)
                    .post(`/api/articles`)
                    .send({

                        title: 'Another cat article',
                        topic: "topic",
                        author: 'badusername',
                        body: 'some images'

                    })
                    .expect(404)
                    .then(({
                        body: {
                            message
                        }
                    }) => {

                        expect(message).toBe("Not Found")

                    });
            });


            it('should return 400 if invalid body value provided ', () => {

                return request(app)
                    .post(`/api/articles`)
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

        describe('PATCH/DELETE', () => {

            it('should return method not allowed', () => {


                return request(app)
                    .patch(`/api/articles`)
                    .expect(405)
                    .then(({
                        body: {
                            message
                        }
                    }) => {

                        expect(message).toEqual("Method Not Allowed")
                    });


            });

        });

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
                                article_id: 3,
                                title: 'Eight pug gifs that remind me of mitch',
                                topic: 'mitch',
                                author: 'icellusedkars',
                                body: 'some gifs',
                                created_at: '2020-11-03T09:12:00.000Z',
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

            describe('PATCH', () => {

                it('Should return status 200 and update the \'votes\' property to the given value', () => {

                    const articleId = 3
                    return request(app)
                        .patch(`/api/articles/${articleId}`).send({
                            inc_votes: 1
                        })
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
                                created_at: '2020-11-03T09:12:00.000Z',
                                votes: 1,
                                comment_count: 2
                            })

                        });

                });


                it('Should return status 200 and update the \'votes\' property when given a negative value', () => {

                    const articleId = 3
                    return request(app)
                        .patch(`/api/articles/${articleId}`).send({
                            inc_votes: -10
                        })
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
                                created_at: '2020-11-03T09:12:00.000Z',
                                votes: -10,
                                comment_count: 2
                            })

                        });

                });


                it('Should return status 200 with an unchanged article if an empty request body is provided', () => {
                    const articleId = 3
                    return request(app)
                        .patch(`/api/articles/${articleId}`)
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
                                created_at: '2020-11-03T09:12:00.000Z',
                                votes: 0,
                                comment_count: 2
                            })

                        });
                });

                it('Should return a 400 error if the request body has more than \'inc_votes\' as a key', () => {

                    const articleId = 3
                    return request(app)
                        .patch(`/api/articles/${articleId}`).send({
                            inc_votes: 1,
                            somethingElse: 2
                        })
                        .expect(400)
                        .then(({
                            body: {
                                message
                            }
                        }) => {

                            expect(message).toBe("Invalid Request")

                        });


                });

                it('Should return a 400 error if the request body does not have \'inc_votes\' as the key', () => {

                    const articleId = 3
                    return request(app)
                        .patch(`/api/articles/${articleId}`).send({
                            inc_messages: 1
                        })
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

            describe('DELETE', () => {

                it('Should delete the requested article and return 204 if successful', () => {

                    const articleId = 1
                    return request(app)
                        .delete(`/api/articles/${articleId}`)
                        .expect(204)
                        .then(() => {
                            return db.query(`SELECT * FROM articles`)
                        })
                        .then(({
                            rows
                        }) => {
                            expect(rows.length).toBe(11)
                        })

                });

                it('Should return 404 if a valid Id format is given by not found', () => {

                    const articleId = 120
                    return request(app)
                        .delete(`/api/articles/${articleId}`)
                        .expect(404)
                        .then(({
                            body: {
                                message
                            }
                        }) => {
                            expect(message).toBe("Not Found")
                        })

                });

                it('Should return 400 if an invalid Id format is given ', () => {

                    const articleId = "wrong"
                    return request(app)
                        .delete(`/api/articles/${articleId}`)
                        .expect(400)
                        .then(({
                            body: {
                                message
                            }
                        }) => {
                            expect(message).toBe("Invalid Request")
                        })

                });

            });

            describe('POST', () => {

                it('should return method not allowed', () => {


                    return request(app)
                        .post(`/api/articles/3`)
                        .expect(405)
                        .then(({
                            body: {
                                message
                            }
                        }) => {

                            expect(message).toEqual("Method Not Allowed")
                        });


                });

            });


            describe('/api/articles/:article_id/comments', () => {

                describe('GET', () => {

                    it('Should return the comments for an article when provided with the ID', () => {

                        const articleId = 3
                        return request(app)
                            .get(`/api/articles/${articleId}/comments`)
                            .expect(200)
                            .then(({
                                body: {
                                    comments
                                }
                            }) => {


                                comments.forEach((comment) => {

                                    expect(Object.keys(comment)).toHaveLength(6)

                                    expect(comment).toMatchObject({
                                        comment_id: expect.any(Number),
                                        author: expect.any(String),
                                        body: expect.any(String),
                                        article_id: expect.any(Number),
                                        votes: expect.any(Number),
                                        created_at: expect.any(String),
                                    });

                                    expect(comment.article_id).toBe(3)

                                })


                            });

                    });


                    it('Should limit the number of articles to 10 by default', () => {

                        const articleId = 1
                        return request(app)
                            .get(`/api/articles/${articleId}/comments`)
                            .expect(200)
                            .then(({
                                body: {
                                    comments
                                }
                            }) => {

                                expect(comments).toHaveLength(10)
                                comments.forEach((comment) => {

                                    expect(Object.keys(comment)).toHaveLength(6)

                                    expect(comment).toMatchObject({
                                        comment_id: expect.any(Number),
                                        author: expect.any(String),
                                        body: expect.any(String),
                                        article_id: expect.any(Number),
                                        votes: expect.any(Number),
                                        created_at: expect.any(String),
                                    });

                                    expect(comment.article_id).toBe(1)

                                })


                            });

                    });

                    it('Should take a \'limit\' query to select the number of results to return', () => {

                        const articleId = 1
                        return request(app)
                            .get(`/api/articles/${articleId}/comments?limit=5`)
                            .expect(200)
                            .then(({
                                body: {
                                    comments
                                }
                            }) => {

                                expect(comments).toHaveLength(5)
                                comments.forEach((comment) => {

                                    expect(Object.keys(comment)).toHaveLength(6)

                                    expect(comment).toMatchObject({
                                        comment_id: expect.any(Number),
                                        author: expect.any(String),
                                        body: expect.any(String),
                                        article_id: expect.any(Number),
                                        votes: expect.any(Number),
                                        created_at: expect.any(String),
                                    });

                                    expect(comment.article_id).toBe(1)

                                })


                            });

                    });



                    it('Should return all results when a limit over the total is given', () => {

                        const articleId = 1
                        return request(app)
                            .get(`/api/articles/${articleId}/comments?limit=500`)
                            .expect(200)
                            .then(({
                                body: {
                                    comments
                                }
                            }) => {
                                expect(comments).toHaveLength(11)
                                comments.forEach((comment) => {

                                    expect(Object.keys(comment)).toHaveLength(6)

                                    expect(comment).toMatchObject({
                                        comment_id: expect.any(Number),
                                        author: expect.any(String),
                                        body: expect.any(String),
                                        article_id: expect.any(Number),
                                        votes: expect.any(Number),
                                        created_at: expect.any(String),
                                    });

                                    expect(comment.article_id).toBe(1)

                                })


                            });

                    });

                    it('Should return 400 status when an incorrect limit value type given', () => {

                        const articleId = 1
                        return request(app)
                            .get(`/api/articles/${articleId}/comments?limit=wrong`)
                            .expect(400)
                            .then(({
                                body: {
                                    message
                                }
                            }) => {

                                expect(message).toBe("Invalid Request")

                            });

                    });


                    it('Should take a \'p\' query to specify which page to return', () => {

                        const articleId = 1
                        return request(app)
                            .get(`/api/articles/${articleId}/comments?limit=2&p=3`)
                            .expect(200)
                            .then(({
                                body: {
                                    comments
                                }
                            }) => {

                                expect(comments).toHaveLength(2)
                                comments.forEach((comment) => {

                                    expect(Object.keys(comment)).toHaveLength(6)

                                    expect(comment).toMatchObject({
                                        comment_id: expect.any(Number),
                                        author: expect.any(String),
                                        body: expect.any(String),
                                        article_id: expect.any(Number),
                                        votes: expect.any(Number),
                                        created_at: expect.any(String),
                                    });

                                    expect(comment.article_id).toBe(1)

                                })

                                expect(comments[0]).toEqual({
                                    comment_id: 6,
                                    author: 'icellusedkars',
                                    article_id: 1,
                                    votes: 0,
                                    created_at: '2020-04-10T23:00:00.000Z',
                                    body: 'I hate streaming eyes even more'
                                })

                                expect(comments[1]).toEqual({
                                    comment_id: 7,
                                    author: 'icellusedkars',
                                    article_id: 1,
                                    votes: 0,
                                    created_at: '2020-05-14T23:00:00.000Z',
                                    body: 'Lobster pot'
                                })


                            });

                    });

                    it('Should return 400 status when an incorrect p value type given', () => {

                        const articleId = 1
                        return request(app)
                            .get(`/api/articles/${articleId}/comments?p=wrong`)
                            .expect(400)
                            .then(({
                                body: {
                                    message
                                }
                            }) => {

                                expect(message).toBe("Invalid Request")

                            });

                    });

                    it('Should return 200 when no comments found but article exists', () => {

                        const articleId = 2
                        return request(app)
                            .get(`/api/articles/${articleId}/comments`)
                            .expect(200)
                            .then(({
                                body: {
                                    comments
                                }
                            }) => {

                                expect(comments).toEqual([])

                            });

                    });


                    it('Should return 404 status when a correct ID value type given, but no article exists', () => {

                        const articleId = 4000
                        return request(app)
                            .get(`/api/articles/${articleId}/comments`)
                            .expect(404)
                            .then(({
                                body: {
                                    message
                                }
                            }) => {

                                expect(message).toBe("Not Found")

                            });

                    });

                    it('Should return 400 status when an incorrect ID value type given', () => {

                        const articleId = 'wrong'
                        return request(app)
                            .get(`/api/articles/${articleId}/comments`)
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


                describe('POST', () => {

                    it('Should return 201 and the new comment when successful', () => {

                        const articleId = 3
                        return request(app)
                            .post(`/api/articles/${articleId}/comments`).send({
                                username: "butter_bridge",
                                body: "A test comment"
                            })
                            .expect(201)
                            .then(({
                                body: {
                                    comment
                                }
                            }) => {


                                expect(Object.keys(comment)).toHaveLength(6)

                                expect(comment).toMatchObject({
                                    comment_id: expect.any(Number),
                                    author: expect.any(String),
                                    body: expect.any(String),
                                    article_id: expect.any(Number),
                                    votes: expect.any(Number),
                                    created_at: expect.any(String),
                                });

                                expect(comment.author).toBe('butter_bridge')
                                expect(comment.body).toBe('A test comment')

                                expect(comment.article_id).toBe(3)




                            });


                    });



                    it('Should return 404 when a user doesn\'t exists, but the username format is valid', () => {

                        const articleId = 3
                        return request(app)
                            .post(`/api/articles/${articleId}/comments`).send({
                                username: "doesnotexist",
                                body: "A test comment"
                            })
                            .expect(404)
                            .then(({
                                body: {
                                    message
                                }
                            }) => {
                                expect(message).toBe("Not Found")

                            });

                    });

                    it('Should return 400 when a user doesn\'t exists, and the username format is invalid', () => {

                        const articleId = 3
                        return request(app)
                            .post(`/api/articles/${articleId}/comments`).send({
                                username: 320,
                                body: "A test comment"
                            })
                            .expect(400)
                            .then(({
                                body: {
                                    message
                                }
                            }) => {
                                expect(message).toBe("Invalid Request")

                            });

                    });

                    it('Should return 400 when an incorrect body is provided', () => {

                        const articleId = 3
                        return request(app)
                            .post(`/api/articles/${articleId}/comments`).send({
                                username: "butter_bridge",
                                body: 300
                            })
                            .expect(400)
                            .then(({
                                body: {
                                    message
                                }
                            }) => {
                                expect(message).toBe("Invalid Request")

                            });

                    });

                    it('Should return 404 when an valid but non-existent article ID provided', () => {

                        const articleId = 300
                        return request(app)
                            .post(`/api/articles/${articleId}/comments`).send({
                                username: "butter_bridge",
                                body: "body"
                            })
                            .expect(404)
                            .then(({
                                body: {
                                    message
                                }
                            }) => {
                                expect(message).toBe("Not Found")

                            });

                    });


                    it('Should return 400 when an invalid article ID provided', () => {

                        const articleId = "incorrect"
                        return request(app)
                            .post(`/api/articles/${articleId}/comments`).send({
                                username: "butter_bridge",
                                body: "body"
                            })
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

                describe('PATCH/DELETE', () => {

                    it('should return method not allowed', () => {


                        return request(app)
                            .patch(`/api/articles/3/comments`)
                            .expect(405)
                            .then(({
                                body: {
                                    message
                                }
                            }) => {

                                expect(message).toEqual("Method Not Allowed")
                            });


                    });

                });

            });



        });


    });


    describe('api/comments', () => {

        describe('GET/POST/PATCH/DELETE', () => {

            it('should return method not allowed', () => {

                return request(app)
                    .get(`/api/comments`)
                    .expect(405)
                    .then(({
                        body: {
                            message
                        }
                    }) => {

                        expect(message).toEqual("Method Not Allowed")
                    });


            });

        });

        describe('api/comments/:comment_id', () => {


            describe('DELETE', () => {

                it('should delete the comment with the chosen ID and return 204 with no body', () => {

                    return request(app)
                        .delete(`/api/comments/3`)
                        .expect(204)
                        .then(() => {

                            return request(app)
                                .get(`/api/articles/1/comments`)

                        }).then(({
                            body: {
                                comments
                            }
                        }) => {
                            expect(comments).toHaveLength(10)
                        })


                });

                it('should return 404 when no comment exists with id in valid format', () => {

                    return request(app)
                        .delete(`/api/comments/300`)
                        .expect(404)
                        .then(({
                            body: {
                                message
                            }
                        }) => {

                            expect(message).toBe("Not Found")
                        });
                });

                it('should return 400 given an invalid id format', () => {

                    return request(app)
                        .delete(`/api/comments/wrong`)
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


            describe('PATCH', () => {

                it('Should return status 200 and update the \'votes\' property to the given value', () => {

                    const commentId = 3
                    return request(app)
                        .patch(`/api/comments/${commentId}`).send({
                            inc_votes: 1
                        })
                        .expect(200)
                        .then(({
                            body: {
                                comment
                            }
                        }) => {

                            expect(Object.keys(comment)).toHaveLength(6)

                            expect(comment).toMatchObject({
                                comment_id: expect.any(Number),
                                body: expect.any(String),
                                votes: expect.any(Number),
                                author: expect.any(String),
                                article_id: expect.any(Number),
                                created_at: expect.any(String)
                            });

                            expect(comment).toMatchObject({
                                comment_id: 3,
                                body: "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
                                votes: 101,
                                author: "icellusedkars",
                                article_id: 1,
                                created_at: "2020-03-01T00:00:00.000Z",
                            })

                        });

                });

                it('Should return status 200 and update the \'votes\' property when given a negative value', () => {

                    const commentId = 3
                    return request(app)
                        .patch(`/api/comments/${commentId}`).send({
                            inc_votes: -10
                        })
                        .expect(200)
                        .then(({
                            body: {
                                comment
                            }
                        }) => {

                            expect(Object.keys(comment)).toHaveLength(6)

                            expect(comment).toMatchObject({
                                comment_id: expect.any(Number),
                                body: expect.any(String),
                                votes: expect.any(Number),
                                author: expect.any(String),
                                article_id: expect.any(Number),
                                created_at: expect.any(String)
                            });

                            expect(comment).toMatchObject({
                                comment_id: 3,
                                body: "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
                                votes: 90,
                                author: "icellusedkars",
                                article_id: 1,
                                created_at: "2020-03-01T00:00:00.000Z",
                            })

                        });

                });

                it('Should return status 200 and an unchanged comment when provided no increase argument in the body', () => {

                    const commentId = 3
                    return request(app)
                        .patch(`/api/comments/${commentId}`).send({

                        })
                        .expect(200)
                        .then(({
                            body: {
                                comment
                            }
                        }) => {

                            expect(Object.keys(comment)).toHaveLength(6)

                            expect(comment).toMatchObject({
                                comment_id: expect.any(Number),
                                body: expect.any(String),
                                votes: expect.any(Number),
                                author: expect.any(String),
                                article_id: expect.any(Number),
                                created_at: expect.any(String)
                            });

                            expect(comment).toMatchObject({
                                comment_id: 3,
                                body: "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
                                votes: 100,
                                author: "icellusedkars",
                                article_id: 1,
                                created_at: "2020-03-01T00:00:00.000Z",
                            })

                        });

                });
                it('Should return status 400 when given an invalid update value', () => {

                    const commentId = 3
                    return request(app)
                        .patch(`/api/comments/${commentId}`).send({
                            inc_votes: "wrong"
                        })
                        .expect(400)
                        .then(({
                            body: {
                                message
                            }
                        }) => {

                            expect(message).toBe("Invalid Request")

                        });

                });

                it('Should return status 404 when given an valid id type that is not found', () => {

                    const commentId = 3000
                    return request(app)
                        .patch(`/api/comments/${commentId}`).send({
                            inc_votes: 1
                        })
                        .expect(404)
                        .then(({
                            body: {
                                message
                            }
                        }) => {

                            expect(message).toBe("Not Found")

                        });

                });


            });




            describe('GET/POST', () => {

                it('should return method not allowed', () => {


                    return request(app)
                        .get(`/api/comments/3`)
                        .expect(405)
                        .then(({
                            body: {
                                message
                            }
                        }) => {

                            expect(message).toEqual("Method Not Allowed")
                        });


                });

            });

        });

    });


    describe('api/users', () => {

        describe('GET', () => {

            it('Should provide an array of usernames and status 200 when successful', () => {

                return request(app)
                    .get("/api/users")
                    .expect(200)
                    .then(({
                        body: {
                            users
                        }
                    }) => {

                        expect(users).toHaveLength(4);
                        users.forEach((user) => {
                            expect(Object.keys(user)).toHaveLength(1)

                            expect(user).toMatchObject({
                                username: expect.any(String)
                            });
                        })

                    });

            });




        });


        describe('POST/PATCH/DELETE', () => {

            it('should return method not allowed', () => {

                return request(app)
                    .delete(`/api/users`)
                    .expect(405)
                    .then(({
                        body: {
                            message
                        }
                    }) => {

                        expect(message).toEqual("Method Not Allowed")
                    });


            });

        });


        describe('api/users/:username', () => {


            describe('GET', () => {

                it('Should return 200 and the user for the username requested', () => {

                    return request(app)
                        .get("/api/users/butter_bridge")
                        .expect(200)
                        .then(({
                            body: {
                                user
                            }
                        }) => {

                            expect(Object.keys(user)).toHaveLength(3)

                            expect(user).toMatchObject({
                                username: expect.any(String),
                                username: expect.any(String),
                                avatar_url: expect.any(String)
                            });

                            expect(user).toMatchObject({
                                username: 'butter_bridge',
                                name: 'jonny',
                                avatar_url: 'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
                            });

                        });
                });

                it('Should return 404 when user is not found for the username', () => {

                    return request(app)
                        .get("/api/users/wrong")
                        .expect(404)
                        .then(({
                            body: {
                                message
                            }
                        }) => {
                            expect(message).toBe("Not Found")

                        });
                });

            });

            describe('POST/PATCH/DELETE', () => {

                it('should return method not allowed', () => {

                    return request(app)
                        .delete(`/api/users/butter_bridge`)
                        .expect(405)
                        .then(({
                            body: {
                                message
                            }
                        }) => {

                            expect(message).toEqual("Method Not Allowed")
                        });


                });

            });

        });


    });

});
