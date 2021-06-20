import './App.css';
import SurveyNavbar from './SurveyNavbar';
import { LoginForm } from './LoginForm';
import AdminContent from './AdminContent';
import UserContent from './UserContent';
import DoSurvey from './DoSurvey';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Container, Row, Button, Modal } from 'react-bootstrap';
import API from './API.js';

function App() {
  /*************************************** USER SESSION MANAGEMENT ******************************************************/

  /* User info */
  const [loggedIn, setLoggedIn] = useState(false); // at the beginning, no user is logged in
  const [message, setMessage] = useState('');      // so no message is shown
  const [loading, setLoading] = useState(false);

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
        setLoading(false);
      });
    }

  }, [loggedIn]);

  return (
    <Router>
      <div style={{ backgroundColor: "#68717a" }} className="row-height">
        <SurveyNavbar message={message} logout={doLogOut} loggedIn={loggedIn} />
        {loading ? <LoadingPage/> : 
        <Container fluid>
          <Switch>
            <Route exact path="/login">
              <>{loggedIn ? <Redirect to="/" /> : <LoginForm login={doLogIn} />}</>
            </Route>

            <Route exact path="/">
              <>{loggedIn ? <AdminContent surveys={surveys} /> : <UserContent surveys={surveys} setLoading={setLoading}/>}</>
            </Route>

            <Route path="/survey/:surveyId" render={({ match }) =>
              <>
                {loggedIn ? <Redirect to="/" /> : <DoSurvey surveyId={match.params.surveyId} loggedIn={loggedIn} loading={loading} setLoading={setLoading} />}
              </>
            } />

            <Route path="/404" component={NotFound} />
            <Redirect to="/404" />
          </Switch>
        </Container>
      }
      </div>
    </Router>
  );
}

function NotFound(props) {
  return (
    <>
      <Row className="justify-content-center">
        <h1 className="text-white mt-2">404: NOT FOUND</h1>
      </Row>
      <Row className="justify-content-center">
        <Button variant="outline-light" onClick={e => { window.location.href = '/'; }}>Back to surveys</Button>
      </Row>
    </>
  );
}

function LoadingPage(props) {
  return (
    <Modal>
        
      </Modal>
  );
}

export default App;
