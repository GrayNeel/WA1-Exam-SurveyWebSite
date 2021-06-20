import { Container, Col, Row } from 'react-bootstrap';

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
                    <Title size={surveys.length}/>
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
        (props.size > 0) ? <Row className="justify-content-center mt-2 text-white"><h2>Here is the list of your surveys</h2></Row> : <Row className="justify-content-center mt-2 text-white"><h2>You have no available surveys. Create a new one!</h2></Row>
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
                <h2 className="text-white" style={{ cursor: "pointer" }} onClick={e => { window.location.href = '/survey/' + props.surveyId; }}>{props.title}</h2>
            </Col>
        </Row>
    );
}

export default AdminContent;