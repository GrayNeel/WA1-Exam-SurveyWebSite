import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { useEffect, useState } from 'react';
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
      setMessage({ msg: `Welcome, ${user.name}!`, type: 'success' });  // Set it again here because otherwise when F5 the message created from LogIn disappears
    }).catch(error => {
      setLoggedIn(false);  // No logged user
    });
  }, []); // only at mount time

  const doLogIn = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      setMessage({ msg: `Welcome, ${user.name}!`, type: 'success' });
    } catch (err) {
      setMessage({ msg: err, type: 'danger' });
      throw "Incorrect username and/or password";
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
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          {loggedIn ? message : "Not logged in"}
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
