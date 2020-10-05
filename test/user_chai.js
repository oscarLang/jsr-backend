process.env.NODE_ENV = 'test';
var assert = require("assert");
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');
const db = require("../db/database.js");

chai.should();
var expect = chai.expect;

chai.use(chaiHttp);

describe('User', () => {
    describe('POST /user/register', () => {
        it('201 Registered user', (done) => {
            chai.request(server)
                .post("/user/register")
                .send({
                    email: "test@test.com",
                    username: "testUser",
                    password: "Test1234"
                })
                .then(function (res) {
                    expect(res).to.have.status(201);
                    expect(res.body).to.be.an("object");
                    done();
                })
                .catch(function (err) {
                    done(err);
                });
        });
        it('401 All fields not filled', (done) => {
            chai.request(server)
                .post("/user/register")
                .send({
                    email: "test@test.com",
                    username: "testUser"
                })
                .then(function (res) {
                    expect(res).to.have.status(401);
                    expect(res.body).to.be.an("object");
                    done();
                })
                .catch(function (err) {
                    done(err);
                });
        });
    });
    describe('POST /user/login', () => {
        it('200 user logged in', (done) => {
            chai.request(server)
                .post("/user/login")
                .send({
                    email: "test@test.com",
                    password: "Test1234"
                })
                .then(function (res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an("object");
                    done();
                })
                .catch(function (err) {
                    done(err);
                });
        });
        it('401 All fields not filled', (done) => {
            chai.request(server)
                .post("/user/login")
                .send({
                    email: "test@test.com"
                })
                .then(function (res) {
                    expect(res).to.have.status(401);
                    expect(res.body).to.be.an("object");
                    done();
                })
                .catch(function (err) {
                    done(err);
                });
        });
        it('404 User not found', (done) => {
            chai.request(server)
                .post("/user/login")
                .send({
                    email: "userNotInDb@test.com",
                    password: "testUser12421"
                })
                .then(function (res) {
                    expect(res).to.have.status(404);
                    expect(res.body).to.be.an("object");
                    done();
                })
                .catch(function (err) {
                    done(err);
                });
        });
        it('401 Password no match', (done) => {
            chai.request(server)
                .post("/user/login")
                .send({
                    email: "test@test.com",
                    password: "testUser12421"
                })
                .then(function (res) {
                    expect(res).to.have.status(401);
                    expect(res.body).to.be.an("object");
                    done();
                })
                .catch(function (err) {
                    done(err);
                });
        });
    });
});
