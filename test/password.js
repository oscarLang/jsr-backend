process.env.NODE_ENV = 'test';

var assert = require("assert");
const userModel = require("../models/user");

describe("Test password match", function() {
        it("should be no match", function() {
            return userModel.checkPass("test1234", "test1234").then(result => {
                assert.equal(result.isSame, false)
            });
        });
        it("should be match", function() {
            return userModel.checkPass("Test1234", "$2a$10$/DZ1LCyAdrZawVGDafdEtOPXfJ.rtxzbNzBr0lwk0s0QL7HrKskEK").then(result => {
                assert.equal(result.isSame, true)
            });
        });
    });
