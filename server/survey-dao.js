'use strict';

const sqlite = require('sqlite3');

// open the database
const db = new sqlite.Database('survey.db', (err) => {
    if (err) throw err;
});

exports.getAllSurveysTitle = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT surveyId, title FROM surveys';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            const surveys = rows.map((s) => ({surveyId: s.surveyId, title: s.title}));
            resolve(surveys);
        })
    })
}

exports.getSurveyById = (surveyId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM surveys WHERE surveyId = ?';
        db.get(sql, [surveyId], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            /** Row is already an object, but the "question" DB column is a string. So, it needs to be parsed */
            if(row !== undefined)
                row.questions = JSON.parse(row.questions);
            resolve(row);
        });
    });
    
}

exports.addSurvey = (surveyId, userId, surveyTitle, questions) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO surveys(surveyId, userId, title, questions) VALUES(?, ?, ?, ?)';
        db.all(sql, [surveyId, userId, surveyTitle, JSON.stringify(questions)], (err) => {
            if(err) {
                reject(err);
                return;
            }

            resolve();
        });
    });
}

exports.getLastSurveyId = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT MAX(surveyId) as lastid FROM surveys';
        db.all(sql, [], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(row[0].lastid);
        });
    });
};

exports.addAnswer = (surveyId, name, answers) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO answers(surveyId, name, answers) VALUES(?, ?, ?)';
        db.all(sql, [surveyId, name, JSON.stringify(answers)], (err) => {
            if(err) {
                reject(err);
                return;
            }

            resolve();
        });
    });
};