import { Container, Col, Row, Button, Form } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Switch, Redirect, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import API from './API.js';

function CreateSurvey(props) {
    // Survey to create
    const [survey, setSurvey] = useState([]);
    // Survey title
    const [title, setTitle] = useState([]);
    const [alert, setAlert] = useState('');

    const [validated, setValidated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (props.loggedIn && validated) {
            API.addNewSurvey(survey).then(newS => {
                setLoading(false);
            }).catch(err => {
                console.log(err);
                setLoading(false);
            });
        }

    }, [props.loggedIn, survey.title, validated]);

    const handleSubmit = (event) => {
        let valid = true;
        const form = event.currentTarget;

        event.preventDefault();


        if (form.checkValidity() === false) {
            event.stopPropagation();
            valid = false;
        }
        else {

        }
        if (valid) {
            setValidated(true);
            setSurvey({ title: title, ...survey });
        } else {
            console.log("HEERE");
        }
    };

    return (
        <>
            <Container>
                <Row className="justify-content-center">
                    <Col className="col-md-auto rounded mt-2 mb-4">
                        <Form noValidate validated={validated} onSubmit={handleSubmit}>
                            <SurveyTitle title={title} setTitle={setTitle} alert={alert} setAlert={setAlert} />
                            {alert.length === 0 ?
                                <AddQuestionButton />
                                : <></>}
                            {/* <QuestionsList loading={loading} questions={survey.questions} answers={answers} editOrAddOpenAnswer={editOrAddOpenAnswer} editOrAddClosedAnswer={editOrAddClosedAnswer} /> : <></>}
                            <EndingButtons name={name} alert={alert} /> */}
                            {validated ? <Redirect to='/' /> : <></>}
                        </Form>
                    </Col>
                </Row>
            </Container >
        </>
    );
}

function SurveyTitle(props) {

    const validateName = (name) => {
        if (name.length < 3) {
            props.setAlert('At least 3 characters');
            props.setTitle(name);
        } else {
            props.setAlert('');
            props.setTitle(name);
        }
    }

    return (
        <Col className="col-md-auto bg-light rounded mt-2 mb-2 ">
            <Row className="">
                <Col className="col-md-auto mt-4 mb-4 rounded-pill">
                    <h3>Insert the title of the survey</h3>
                    <Form.Control type="text" placeholder="Insert survey title here" value={props.title} onChange={td => validateName(td.target.value)} required />
                    <Form.Label className="text-danger">{props.alert}</Form.Label>
                </Col>
            </Row>
        </Col>
    );
}

function AddQuestionButton(props) {
    return (
        <div className="d-flex justify-content-center mt-4">
                <Button variant="outline-light">Add new question</Button>
        </div>
    );
}

export default CreateSurvey;