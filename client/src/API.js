'use strict';

async function getAvailableSurveys() {
    try {
        const response = await fetch('/api/surveys/all');
        if (response.ok) {
            const surveys = await response.json();
            return surveys;
        }
        else {
            throw new Error(response.statusText);
        }
    } catch (err) {
        console.log(err);
        throw new Error(err);
    }
}

async function getSurveyById(surveyId) {
    try {
        const response = await fetch('/api/surveys?id=' + surveyId);
        if (response.ok) {
            const survey = await response.json();
            return survey;
        }
        else {
            throw new Error(response.statusText);
        }
    } catch (err) {
        console.log(err);
        throw new Error(err);
    }
}

/*********************************** USER'S SESSION API *********************************************/

async function logIn(credentials) {
    let response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });
    if (response.ok) {
        const user = await response.json();
        return user.name;
    }
    else {
        try {
            const errDetail = await response.json();
            throw errDetail.message;
        }
        catch (err) {
            throw err;
        }
    }
}

async function logOut() {
    await fetch('/api/sessions/current', { method: 'DELETE' });
}

async function getUserInfo() {
    const response = await fetch('api/sessions/current');
    const userInfo = await response.json();
    if (response.ok) {
        return userInfo;
    } else {
        throw userInfo;  // an object with the error coming from the server
    }
}

const API = { getAvailableSurveys, getSurveyById, logIn, logOut, getUserInfo };


export default API;