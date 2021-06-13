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
        db.all(sql, [surveyId], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            const survey = row.map((s) => ({ surveyId: s.surveyId, userId: s.userId, title: s.title, questions: JSON.parse(s.questions)}));
            resolve(survey);
        });
    });
    
}