process.env.NODE_ENV = 'test';
var assert = require("assert");
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');
const db = require("../db/database.js");


chai.should();
var expect = chai.expect;

chai.use(chaiHttp);

describe('reports', () => {
    before(() => {
        return new Promise(resolve => {
            week = 1;
            text = "#test1234";
            db.run("INSERT INTO reports (week, text_data) VALUES (?, ?)", week, text, (err) => {
                if (err) {
                    console.log("error inserting test report");
                }
                resolve();
            });
        });
    });
    describe('GET /reports/week/1', () => {
        it('200 HAPPY PATH', (done) => {
            chai.request(server)
                .get("/reports/week/1")
                .then(function (res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an("object");
                    done();
                })
                .catch(function (err) {
                    done(err);
                });
        });
        it('404 NOT FOUND', (done) => {
            chai.request(server)
                .get("/reports/week/2")
                .then(function (res) {
                    expect(res).to.have.status(404);
                    expect(res.body).to.be.an("object");
                    done();
                })
                .catch(function (err) {
                    done(err);
                });
        });
    });
    describe('POST /reports', () => {
        it('201 HAPPY PATH', (done) => {
            chai.request(server)
                .post("/reports")
                .send({ week: 2, text: '#TEST INSERT WEEK 2' })
                .then(function (res) {
                    expect(res).to.have.status(201);
                    done();
                })
                .catch(function (err) {
                    done(err);
                });
        });
        it('500 Already exists', (done) => {
            chai.request(server)
                .post("/reports")
                .send({ week: 2, text: '#TEST INSERT WEEK 2' })
                .then(function (res) {
                    expect(res).to.have.status(500);
                    done();
                })
                .catch(function (err) {
                    done(err);
                });
        });
        it('401 NOT ALL FIELDS FILLED', (done) => {
            chai.request(server)
                .post("/reports")
                .send({ week: 2})
                .then(function (res) {
                    expect(res).to.have.status(401);
                    done();
                })
                .catch(function (err) {
                    done(err);
                });
        });
    });
    describe('PUT /reports', () => {
        it('201 HAPPY PATH', (done) => {
            chai.request(server)
                .put("/reports")
                .send({ week: 2, text: '#Updated text' })
                .then(function (res) {
                    expect(res).to.have.status(201);
                    done();
                })
                .catch(function (err) {
                    done(err);
                });
        });
        it('401 NOT ALL FIELDS FILLED', (done) => {
            chai.request(server)
                .put("/reports")
                .send({ week: 2})
                .then(function (res) {
                    expect(res).to.have.status(401);
                    done();
                })
                .catch(function (err) {
                    done(err);
                });
        });
    });
    describe('DELETE /reports', () => {
        it('200 HAPPY PATH', (done) => {
            chai.request(server)
                .delete("/reports")
                .send({ week: 2})
                .then(function (res) {
                    expect(res).to.have.status(200);
                    done();
                })
                .catch(function (err) {
                    done(err);
                });
        });
        it('401 NOT ALL FIELDS FILLED', (done) => {
            chai.request(server)
                .delete("/reports")
                .send({})
                .then(function (res) {
                    expect(res).to.have.status(401);
                    done();
                })
                .catch(function (err) {
                    done(err);
                });
        });
    });
});
