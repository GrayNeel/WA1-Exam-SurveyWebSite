import logo from './logo.svg';
import './App.css';
import SurveyNavbar from './SurveyNavbar';
import { LoginForm, LogoutButton } from './LoginForm';
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
      throw new Error("Incorrect username and/or password");
    }
  }

  const doLogOut = async () => {
    await API.logOut();
    setLoggedIn(false);
    // clean up everything
    //setTasks([]);
    //setLastId(0);
  }

  /**********************************************************************************************************************/

  return (
    <Router>
      <SurveyNavbar message={message} logout={doLogOut} loggedIn={loggedIn} />
      <Container fluid>
        <Route exact path="/login">
          <>{loggedIn ? <Redirect to="/" /> : <LoginForm login={doLogIn} />}</>
        </Route>
      </Container>
    </Router>
  );
}

export default App;
