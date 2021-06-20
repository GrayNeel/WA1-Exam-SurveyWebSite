import { Container, Col, Row } from 'react-bootstrap';

function UserContent(props) {
    return (
        <>
            <Container>
                <Title />
                <Row className="justify-content-center">
                    <Col className="col-md-auto bg-light rounded mt-2 ">
                    <SurveyTable surveys={props.surveys} setLoading={props.setLoading}/>
                    </Col>
                </Row>
            </Container>
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
                {props.surveys.map(survey => <SurveyRow key={survey.surveyId} surveyId={survey.surveyId} title={survey.title} setLoading={props.setLoading}/> )}
            </Container>
        </>
    );
}

function SurveyRow(props) {
    return (
        <Row className="justify-content-center">
            <Col className="col-md-auto mt-4 mb-4 bg-secondary rounded-pill">
                    <h2 className="text-white" style={{cursor: "pointer"}} onClick={e => {props.setLoading(true); window.location.href='/survey/'+props.surveyId;}}>{props.title}</h2>
            </Col>
        </Row>
    );
}

export default UserContent;