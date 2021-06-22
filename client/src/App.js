import './App.css';
import SurveyNavbar from './SurveyNavbar';
import { LoginForm } from './LoginForm';
import AdminContent from './AdminContent';
import UserContent from './UserContent';
import NotFound from './NotFound';
import DoSurvey from './DoSurvey';
import CreateSurvey from './CreateSurvey';
import ShowAnswers from './ShowAnswers';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import API from './API.js';

function App() {
  /*************************************** USER SESSION MANAGEMENT ******************************************************/

  /* User info */
  const [loggedIn, setLoggedIn] = useState(false); // at the beginning, no user is logged in
  const [message, setMessage] = useState('');      // so no message is shown

  /** Ask server if user is logged in everytime the page is mounted. This information is stored in the cookie of the session */
  useEffect(() => {
    API.getUserInfo().then(user => {
      setLoggedIn(true);
      setMessage({ msg: `Welcome back, ${user.name}!`, type: 'success' });  // Set it again here because otherwise when F5 the message created from LogIn disappears
    }).catch(error => {
      setLoggedIn(false);  // No logged user
    });
  }, []); // only at mount time

  const doLogIn = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      setMessage({ msg: `Welcome back, ${user}!`, type: 'success' });
    } catch (err) {
      setMessage({ msg: err, type: 'danger' });
      throw "Incorrect username and/or password";
    }
  }

  const doLogOut = async () => {
    await API.logOut();
    setLoggedIn(false);
  }

  /**********************************************************************************************************************/
  return (
    <Router>
      <div style={{ backgroundColor: "#68717a" }} className="row-height">
        <SurveyNavbar message={message} logout={doLogOut} loggedIn={loggedIn} />
        <Container fluid>
          <Switch>
            <Route exact path="/login">
              <>{loggedIn ? <NotFound/> : <LoginForm login={doLogIn} />}</>
            </Route>

            <Route exact path="/">
              <>{loggedIn ? <AdminContent loggedIn={loggedIn}/> : <UserContent loggedIn={loggedIn}/>}</>
            </Route>

            <Route path="/survey/:surveyId" render={({ match }) =>
              <>
                {loggedIn ? <NotFound/> : <DoSurvey surveyId={match.params.surveyId} loggedIn={loggedIn} />}
              </>
            } />

            <Route exact path="/admin/new">
              <>
                {loggedIn ? <CreateSurvey/> : <NotFound/>}
              </>
            </Route>

            <Route path="/admin/survey/:surveyId" render={({ match }) =>
              <>
                {loggedIn ? <ShowAnswers surveyId={match.params.surveyId} loggedIn={loggedIn}/> : <NotFound/>}
              </>
            } />

            <Route path="/404" component={NotFound} />
            <Redirect to="/404" />
          </Switch>
        </Container>
      </div>
    </Router>
  );
}



export default App;
