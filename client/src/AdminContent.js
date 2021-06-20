import { Container, Col, Row, Button } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Switch, Redirect, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import API from './API.js';

function AdminContent(props) {

    const [surveys, setSurveys] = useState([]);
    const [loading, setLoading] = useState(true);
    //Rehydrate surveys at mount time
    useEffect(() => {
        if (!props.loggedIn) {
            API.getAvailableSurveysLogged().then(newS => {
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
                    <Title surveys={surveys} />
                    <Row className="justify-content-center">
                        <Col className="col-md-auto rounded mt-2 ">
                            <SurveyTable surveys={surveys} />
                        </Col>

                    </Row>
                    <div className="d-flex justify-content-center mt-3">
                        <Link to={"/admin/new"}>
                            <Button variant="outline-light">Create a new survey</Button>
                        </Link>
                    </div>
                </Container>
            }
        </>
    );
}

function Title(props) {
    return (
        !(props.surveys.err) ? <Row className="justify-content-center mt-2 text-white"><h2>Here is the list of your surveys</h2></Row> : <Row className="justify-content-center mt-2 text-white"><h2>You have no available surveys</h2></Row>
    );
}

function SurveyTable(props) {
    return (
        <>
            {!props.surveys.err ? props.surveys.map(survey =>
                <SurveyRow
                    key={survey.surveyId}
                    surveyId={survey.surveyId}
                    title={survey.title}
                    answersNumber={survey.answersNumber}
                />
            ) : <></>}
        </>
    );
}

function SurveyRow(props) {
    return (
        <>
            <Col className="col-md-auto bg-light rounded mt-2 mb-2 ">
                <Row className="">
                    <Col className="col-md-auto mt-4 mb-4 rounded-pill">
                        <h3>{props.title}</h3>
                        <span>Number of answers: {props.answersNumber}</span>
                    </Col>
                    <Col className="col-md-auto mt-4 mb-4 justify-content-center">
                        <Link to={"/admin/survey/"+props.surveyId}>
                            <Button variant="secondary">Answers</Button>
                        </Link>
                    </Col>
                </Row>
            </Col >
        </>
    );
}


export default AdminContent;