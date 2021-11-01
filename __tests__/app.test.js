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

});
