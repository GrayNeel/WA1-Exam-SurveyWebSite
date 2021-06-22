# Exam #1: "Survey"
## Student: s281554 SMORTI MARCO 

## React Client Application Routes

- Route `/`: this route shows all available surveys to unregistered user. If logged in, only administrator's survey are shown
- Route `/login`: route to login by using credentials (email and password)
- Route `/survey/:surveyId`: route to answer a survey. Only unlogged user can access it, otherwise 404 page is shown.
- Route `/admin/new`: route for logged administrators only. It allows the creation of a new survey.
- Route `/admin/survey/:surveyId`: route for logged administrators only. It shows answers to a specific surveyId (only if the owner is the logged user).
- Route ``: 
- Route ``: 


## API Server

- POST `/api/login`
  - request parameters and request body content
  - response body content
- GET `/api/something`
  - request parameters
  - response body content
- POST `/api/something`
  - request parameters and request body content
  - response body content
- ...

## Database Tables

- Table `users` - contains xx yy zz
- Table `something` - contains ww qq ss
- ...

## Main React Components

- `ListOfSomething` (in `List.js`): component purpose and main functionality
- `GreatButton` (in `GreatButton.js`): component purpose and main functionality
- ...

(only _main_ components, minor ones may be skipped)

## Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

| id |      email        |  name   | password    |
| -- | ----------------- | ------- | ----------- |
|  1 | prova@example.com | admin   |  strong     |
|  2 | rob@aol.com       | rob     |  impossible |
|  3 | io@polito.it      | student |  polito     |
