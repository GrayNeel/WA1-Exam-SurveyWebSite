import './App.css';
import SurveyNavbar from './SurveyNavbar';
import { LoginForm } from './LoginForm';
import AdminContent from './AdminContent';
import UserContent from './UserContent';
import DoSurvey from './DoSurvey';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import API from './API.js';

function App() {
  /*************************************** USER SESSION MANAGEMENT ******************************************************/

  /* User info */
  const [loggedIn, setLoggedIn] = useState(false); // at the beginning, no user is logged in
  const [message, setMessage] = useState('');      // so no message is shown
  const [loading, setLoading] = useState(true);

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
  const [surveys, setSurveys] = useState([]);

  //Rehydrate surveys at mount time
  useEffect(() => {
    if (!loggedIn) {
      API.getAvailableSurveys().then(newS => {
        setSurveys(newS);
        setLoading(false);
      }).catch(err => {
        console.log(err);
        setSurveys([]);
      });
    }

  }, [loggedIn]);

  return (
    <Router>
      <div style={{ backgroundColor: "#68717a" }} className="row-height">
        <SurveyNavbar message={message} logout={doLogOut} loggedIn={loggedIn} />
        <Container fluid>
          <Route exact path="/login">
            <>{loggedIn ? <Redirect to="/" /> : <LoginForm login={doLogIn} />}</>
          </Route>

          <Route exact path="/">
            <>{loggedIn ? <AdminContent surveys={surveys} /> : <UserContent surveys={surveys} />}</>
          </Route>

          <Route path="/survey/:surveyId" render={({ match }) =>
            <>
              {loggedIn ? <Redirect to="/" /> : <DoSurvey surveyId={match.params.surveyId} loggedIn={loggedIn} setLoading={setLoading} />}
            </>
          } />
        </Container>
      </div>
    </Router>
  );
}

export default App;
