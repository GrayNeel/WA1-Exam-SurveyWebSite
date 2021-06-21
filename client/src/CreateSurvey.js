import { Container, Col, Row, Button, Form, Modal } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Switch, Redirect, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import API from './API.js';

function CreateSurvey(props) {
    // Survey to create
    const [survey, setSurvey] = useState([]);
    // Survey title
    const [title, setTitle] = useState([]);
    const [alert, setAlert] = useState('At least 3 characters');

    // Modal to add questions
    const [showModal, setShowModal] = useState(false);

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
                                <>
                                    <AddQuestionButton setShow={setShowModal} />
                                    <QuestionsList loading={loading} questions={survey} />
                                </>
                                : <></>}
                            {validated ? <Redirect to='/' /> : <></>}
                        </Form>
                    </Col>
                </Row>
                <AddQuestionModal show={showModal} setShow={setShowModal} />
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
            <Button variant="outline-light" onClick={() => props.setShow(true)}>Add new question</Button>
        </div>
    );
}

function QuestionsList(props) {
    return (
        <>
            {(props.loading === false) && props.questions ? props.questions.map(question =>
                <Question
                    key={question.questionId}
                    questionId={question.questionId}
                    title={question.title}
                    min={question.min}
                    max={question.max}
                    options={question.options}
                    mandatory={question.mandatory}
                />
            ) : <></>
            }
        </>
    );
}

function Question(props) {
    return (
        <Col className="col-md-auto bg-light rounded mt-2 mb-2 ">
            <Row className="">
                <Col className="col-md-auto mt-4 mb-4 rounded-pill">
                    <h3>{props.title}</h3>
                    {props.mandatory !== undefined ?
                        <OpenQuestion mandatory={props.mandatory} questionId={props.questionId} answers={props.answers} />
                        :
                        <ClosedQuestion min={props.min} max={props.max} options={props.options} questionId={props.questionId} answers={props.answers} editOrAddClosedAnswer={props.editOrAddClosedAnswer} />
                    }
                </Col>
            </Row>
        </Col>
    );
}

function OpenQuestion(props) {
    let actualAnswer = props.answers.find(o => o.questionId === props.questionId);

    return (
        <Form.Group className="mb-3" controlId={props.questionId}>
            <Form.Control as="textarea" rows={5} value={actualAnswer ? actualAnswer.openAnswer : ''} disabled />
        </Form.Group>
    );
}

function ClosedQuestion(props) {
    return (
        <>
            {props.max === 1 ?
                <>
                    <Form.Group className="ml-3" controlId={props.questionId}>
                        <br></br>
                        {props.options.map((option) =>
                            <Form.Check
                                key={option.optionId}
                                id={option.questionId}
                                name={option.questionId}
                                type={'radio'}
                                label={option.text}
                                checked={props.answers.find(o => o.questionId === props.questionId) !== undefined ?
                                    props.answers.find(o => o.questionId === props.questionId).selOptions.find(op => op === option.optionId) !== undefined ? true : false
                                    :
                                    false
                                }
                                disabled
                            />
                        )}
                    </Form.Group>
                    <span className="text-monospace" style={{ fontSize: "12px" }}>Minimum answers: {props.min} </span>
                    <br></br>
                    <span className="text-monospace" style={{ fontSize: "12px" }}>Maximum answers: {props.max} </span>
                </>
                :
                <>
                    <Form.Group className="ml-3">
                        <br></br>
                        {props.options.map((option) =>
                            <Form.Check
                                key={option.optionId}
                                id={option.questionId}
                                name={option.questionId}
                                type={'checkbox'}
                                label={option.text}
                                checked={props.answers.find(o => o.questionId === props.questionId) !== undefined ?
                                    props.answers.find(o => o.questionId === props.questionId).selOptions.find(op => op === option.optionId) !== undefined ? true : false
                                    :
                                    false
                                }
                                disabled
                            />
                        )}
                    </Form.Group>
                    <span className="text-monospace" style={{ fontSize: "12px" }}>Minimum answers: {props.min} </span>
                    <br></br>
                    <span className="text-monospace" style={{ fontSize: "12px" }}>Maximum answers: {props.max} </span>
                </>
            }
        </>
    );
}

function AddQuestionModal(props) {
    // Open question = 0, Closed question = 1
    const [type, setType] = useState(-1);
    const handleClose = () => props.setShow(false);
    const [validated, setValidated] = useState(false);

    const handleSubmit = () => {};

    return (
        <>
            <Modal show={props.show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add a new question</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Label className="text-monospace" style={{ fontSize: "15px" }}>Choose the type of question:</Form.Label>
                        <Form.Check
                            label="Open Question"
                            name="group1"
                            type="radio"
                            id={`inline-radio-2`}
                            className="text-monospace"
                            onChange={() => setType(0)}
                            checked={type === 0 ? true : false}
                        /><Form.Check
                            label="Closed Question"
                            name="group1"
                            type="radio"
                            id={`inline-radio-2`}
                            className="text-monospace mb-2"
                            onChange={() => setType(1)}
                            checked={type === 1 ? true : false}
                        />
                        {type === -1 ? <></> :
                            type === 0 ?
                                //Open question
                                <>
                                    <h5>Open question</h5>
                                    <Form.Label className="text-monospace" style={{ fontSize: "15px" }}>Title</Form.Label>
                                    <Form.Control type="text" placeholder="Type the title of the question here" className="mb-1" />
                                    <Form.Label className="text-monospace" style={{ fontSize: "15px" }}>Is it mandatory?</Form.Label>
                                    <br></br>
                                    <Form.Check
                                        inline
                                        label="Yes"
                                        name="group2"
                                        type="radio"
                                        id={`inline-radio-3`}
                                        className="text-monospace"
                                    />
                                    <Form.Check
                                        inline
                                        label="No"
                                        name="group2"
                                        type="radio"
                                        id={`inline-radio-3`}
                                        className="text-monospace"
                                    />
                                </>
                                :
                                //Closed Question
                                <>
                                    <h5>Closed question</h5>
                                    <Form.Label className="text-monospace" style={{ fontSize: "15px" }}>Title</Form.Label>
                                    <Form.Control type="text" placeholder="Type the title of the question here" className="mb-1" />
                                    <Form.Label className="text-monospace" style={{ fontSize: "15px" }}>Min answers</Form.Label>
                                    <Form.Control type="text" placeholder="Type the number of minimum admitted answers here" className="mb-1" />
                                    <Form.Label className="text-monospace" style={{ fontSize: "15px" }}>Max answers</Form.Label>
                                    <Form.Control type="text" placeholder="Type the number of maximum admitted answers here" className="mb-1" />
                                    <Form.Label className="text-monospace" style={{ fontSize: "15px" }}>Options</Form.Label>
                                    <br></br>
                                    <Button variant="secondary">Add option</Button>
                                </>
                        }
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Back
                    </Button>
                    <Button variant="dark" type="submit">
                        Add
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default CreateSurvey;