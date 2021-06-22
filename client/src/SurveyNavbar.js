import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import gray from './GraySurvey.svg';
import { Navbar } from 'react-bootstrap';
function SurveyNavbar(props) {
    return (
        <>
            <Navbar bg="dark" variant="dark" expand="lg" className="justify-content-between">
                <Navbar.Brand href="/" className="d-inline-block">
                    <img alt="" src={gray} width="23" height="23" className="d-inline-block" />
                    <span className="ml-1">GraySurvey</span>
                </Navbar.Brand>

                <Navbar.Text className="mr-2 text-white">
                    {props.loggedIn ? props.message.msg : ""}
                </Navbar.Text>

                {props.loggedIn ?
                    <>
                        <div style={{ cursor: "pointer" }} onClick={props.logout}>
                            <Navbar.Text className="mr-2 text-white">
                                Logout
                            </Navbar.Text>
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="white" className="bi bi-box-arrow-in-left" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M10 3.5a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 1 1 0v2A1.5 1.5 0 0 1 9.5 14h-8A1.5 1.5 0 0 1 0 12.5v-9A1.5 1.5 0 0 1 1.5 2h8A1.5 1.5 0 0 1 11 3.5v2a.5.5 0 0 1-1 0v-2z" />
                                <path fillRule="evenodd" d="M4.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H14.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z" />
                            </svg>
                        </div>
                    </>
                    :
                    <>
                        <a href="/login">
                            <Navbar.Text className="mr-2 text-white">
                                Login
                            </Navbar.Text>
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="white" className="bi bi-box-arrow-in-right" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0v-2z" />
                                <path fillRule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z" />
                            </svg>
                        </a>
                    </>
                }
            </Navbar>
        </>
    );
}

export default SurveyNavbar;