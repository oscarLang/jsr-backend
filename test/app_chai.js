process.env.NODE_ENV = 'test';
var assert = require("assert");
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');
const db = require("../db/database.js");

chai.should();
var expect = chai.expect;

chai.use(chaiHttp);

describe('App/index', () => {
    describe('GET /', () => {
        it('GET index', (done) => {
            chai.request(server)
                .get("/")
                .then(function (res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an("object");
                    done();
                })
                .catch(function (err) {
                    done(err);
                });
        });
        it('404 Route not found', (done) => {
            chai.request(server)
                .get("/dwadwdadaw")
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
});
