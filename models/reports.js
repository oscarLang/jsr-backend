const db = require("../db/database.js");

async function getReport(week) {
    return new Promise(resolve => {
        var data = {
            status: 500,
            msg: "Unspecified error",
            text:""
        };
        db.get("SELECT text_data FROM reports WHERE week = ?;", week, (err, row) => {
            if (err) {
                data = {
                    status: 500,
                    msg: err,
                    text:""
                };
            } else {
                if (row == null) {
                    data = {
                        status: 401,
                        msg: "No report with week id " + week,
                        text:""
                    };
                } else {
                    data = {
                        status: 200,
                        msg: "Report with week id " + week,
                        text: row.text_data
                    };
                }
            }
            resolve(data);
        });
    });
}

async function insertReport(week, text) {
    return new Promise(resolve => {
        db.run("INSERT INTO reports (week, text_data) VALUES (?, ?)", week, text, (err) => {
            if (err) {
                resolve({
                    status: 500,
                    msg: "Database failed to insert",
                    err: err
                });
            }
            resolve({
                    status: 201,
                    msg: "Got a POST request, sending back 201 Created"
                });
        });
    });
}

async function updateReport(week, text) {
    return new Promise(resolve => {
        db.run("UPDATE reports SET text_data = ? WHERE week = ?", text, week, (err) => {
            if (err) {
                resolve({
                    status: 500,
                    msg: "Database failed to update",
                    err: err
                });
            }
            resolve({
                msg: "Got a PUT request, sending back 201 Created",
                status: 201
            });
        });
    });
}

async function deleteReport(week) {
    return new Promise(resolve => {
        db.run("DELETE FROM reports WHERE week = ?", week, (err) => {
            if (err) {
                resolve({
                    msg: "Database failed to delete",
                    err: err,
                    status: 500
                });
            }
            resolve({
                msg: "Got a DELETE request",
                status: 200
            });
        });
    });
}

module.exports = {
    get: getReport,
    insert: insertReport,
    update: updateReport,
    delete: deleteReport,
};
