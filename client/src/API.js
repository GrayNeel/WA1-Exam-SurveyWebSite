async function getAvailableSurveys() {
    const response = await fetch('/api/surveys/all');
    if (response.ok) {
        const surveys = await response.json();
        return surveys;
    }
    else {
        return { 'err': 'GET error' };
    }
}

async function getSurveyById(surveyId) {
    const response = await fetch('/api/surveys?id=' + surveyId);
    if (response.ok) {
        const survey = await response.json();
        return survey;
    }
    else {
        return { 'err': 'GET error' };
    }
}

async function addNewSurvey(survey) {
    const response = await fetch('api/surveys/new', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(survey)
    });

    if (response.ok) {
        return null;
    } else {
        return { 'err': 'POST error' };
    }
};

async function addNewAnswer(answer) {
    await fetch('api/surveys/answer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(answer)
    });
}

async function getAvailableSurveysLogged() {
    const response = await fetch('/api/surveys/my');
    if (response.ok) {
        const surveys = await response.json();
        return surveys;
    }
    else {
        return { 'err': 'GET error' };
    }
}

async function getAnswersOfSurvey(surveyId) {
    const response = await fetch('http://localhost:3001/api/surveys/get/answers?id='+surveyId);
    if (response.ok) {
        const answers = await response.json();
        return answers;
    }
    else {
        return { 'err': 'GET error' };
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
    const response = await fetch('http://localhost:3000/api/sessions/current');
    const userInfo = await response.json();
    if (response.ok) {
        return userInfo;
    } else {
        throw userInfo;  // an object with the error coming from the server
    }
}

const API = { getAvailableSurveys, getAvailableSurveysLogged, getAnswersOfSurvey, getSurveyById, addNewSurvey, addNewAnswer, logIn, logOut, getUserInfo };


export default API;