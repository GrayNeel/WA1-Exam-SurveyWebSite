import { Container, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import API from './API.js';
import './App.css';

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
                        <Col className="col-md-auto rounded mt-2 ">
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
            {props.surveys.map(survey => <SurveyRow key={survey.surveyId} surveyId={survey.surveyId} title={survey.title} />)}
        </>
    );
}

function SurveyRow(props) {
    return (
        <Col className="col-md-auto bg-light rounded mt-2 mb-2">
            <Row className="d-flex justify-content-md-center">
                <Col className="col-md-auto mt-4 mb-4 rounded-pill">
                    <Link to={"/survey/" + props.surveyId} style={{ textDecoration: 'none' }}>
                        <h2 className="survey-hover">{props.title}</h2>
                    </Link>
                </Col>
            </Row>
        </Col>
    );
}

export default UserContent;