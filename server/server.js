'use strict';

const express = require('express');
/* Debugging middleware (prints all request on console) */
const morgan = require('morgan');
/* This is a middleware that handles "session" (user) */
const session = require('express-session'); 

/* Init express */
const app = new express();
const port = 3001;

/** Import DB queries */
const userDao = require('./user-dao');

/********************************* Session Management ************************************/

/** Middleware for log-in and log-out */
const passport = require('passport');
const passportLocal = require('passport-local');

/** Initialize and configure passport */
passport.use(new passportLocal.Strategy((username, password, done) => {
  /** verification callback for authentication */
  userDao.getUser(username, password).then(user => {
      if (user)
          done(null, user);
      else
          done(null, false, { message: 'Username or password wrong' });
  }).catch(err => {
      done(err);
  });
}));

/** serialize and de-serialize the user (user object <-> session)
 *  we serialize the user id and we store it in the session: the session is very small in this way
 */
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// starting from the data in the session, we extract the current (logged-in) user
// This is so powerful because now we can access data stored in the db for the current user, simply writing req.user
// I have to write another api to make frontend able to user the same information: this api is app.get('/api/sessions/current')
passport.deserializeUser((id, done) => {
  user_dao.getUserById(id)
      .then(user => {
          done(null, user); // this will be available in req.user
      }).catch(err => {
          done(err, null);
      });
});

// custom middleware: check if a given request is coming from an authenticated user
// simple way could be check req.isAuthenticated() at the beginning of every callback body in each route to protect
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated())
      // SE SONO AUTENTICATO POSSO PROCEDERE A CHIAMARE LA FUNZIONE CHE SEGUE, CHE SARA' IL CORPO DELLE RICHIESTE GET/POST
      return next();
  // altrimenti ritorno l'errore e non proseguo al prossimo middleware
  return res.status(401).json({ error: 'not authenticated' });
}

// initialize and configure HTTP sessions
app.use(session({
  secret: 'Elementary, my dear Watson.',
  resave: false,
  saveUninitialized: false
}));

// tell passport to use session cookies
app.use(passport.initialize());
app.use(passport.session());

/*****************************************************************************************/
/************************************** API **********************************************/

/** Enable morgan for logs */
app.use(morgan('dev'));
/** to parse the tasks from string to json */
app.use(express.json()); 

app.get('/', (req, res) => {
  res.send('Hello World, from your server');
});

/*****************************************************************************************/
/************************************* USER'S API ****************************************/
// POST /sessions 
// login
//TODO: 
app.post('/api/sessions', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
      if (err)
          return next(err);
      if (!user) {
          // display wrong login messages
          return res.status(401).json(info);
      }
      // success, perform the login
      req.login(user, (err) => {
          if (err)
              return next(err);

          // req.user contains the authenticated user, we send all the user info back
          // this is coming from userDao.getUser()
          return res.json(req.user);
      });
  })(req, res, next);
});

// DELETE /sessions/current 
// logout
app.delete('/api/sessions/current', isLoggedIn, (req, res) => {
  req.logout();
  res.end();
});

// GET /sessions/current
// check whether the user is logged in or not
app.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated()) {
      res.status(200).json(req.user);
  }
  else
      res.status(401).json({ error: 'Unauthenticated user!' });
});

/*****************************************************************************************/

/** If i get here, it is an unknown route */
app.use(function (req, res) {
  res.status(404).json({error: 'Not found!'});
});

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});