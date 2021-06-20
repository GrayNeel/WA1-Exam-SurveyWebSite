import { Container, Col, Row } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Switch, Redirect, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import API from './API.js';

function UserContent(props) {
    const [surveys, setSurveys] = useState([]);
    const [loading, setLoading] = useState(true);
    //Rehydrate surveys at mount time
    useEffect(() => {
        if (!props.loggedIn) {
            API.getAvailableSurveys().then(newS => {
                setSurveys(newS);
                setLoading(false);
            }).catch(err => {
                console.log(err);
                setSurveys([]);
                setLoading(false);
            });
        }

    }, [props.loggedIn]);

    return (
        <>
            {loading === true ? <></> :
                <Container>
                    <Title />
                    <Row className="justify-content-center">
                        <Col className="col-md-auto bg-light rounded mt-2 ">
                            <SurveyTable surveys={surveys} />
                        </Col>
                    </Row>
                </Container>
            }
        </>
    );
}

function Title(props) {
    return (
        <Row className="justify-content-center mt-2 text-white"><h2>Choose a survey and start answering!</h2></Row>
    );
}

function SurveyTable(props) {
    return (
        <>
            <Container className="rounded">
                {props.surveys.map(survey => <SurveyRow key={survey.surveyId} surveyId={survey.surveyId} title={survey.title} />)}
            </Container>
        </>
    );
}

function SurveyRow(props) {
    return (
        <Row className="justify-content-center">
            <Col className="col-md-auto mt-4 mb-4 bg-secondary rounded-pill">
                <Link to={"/survey/" + props.surveyId} style={{ textDecoration: 'none' }}>
                    <h2 className="text-white" style={{ cursor: "pointer" }} >{props.title}</h2>
                </Link>
            </Col>
        </Row>
    );
}

export default UserContent;