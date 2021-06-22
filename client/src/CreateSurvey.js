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

    const [error, setError] = useState(false);

    // Modal to add questions
    const [showModal, setShowModal] = useState(false);

    const [validated, setValidated] = useState(false);
    const [loading, setLoading] = useState(false);

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
            if (survey.length === 0) {
                setError('You provided no questions to survey. Add at least one question to send it.');
                valid = false;
                event.stopPropagation();
            }
        }

        if (valid) {
            API.addNewSurvey({ title: title, questions: survey }).then(() => {
                setValidated(true);
                setError(false);
            });
        }
    };

    const removeQuestion = (questionId) => {
        // Go back to 0 counting
        questionId = questionId - 1;
        setSurvey(oldSurvey => {
            let temp = oldSurvey.slice();
            temp.splice(questionId, 1);
            return temp;
        });
    }

    const moveQuestionUp = (questionId) => {
        // Go back to 0 counting
        questionId = questionId - 1;

        let newIndex = questionId - 1;
        let oldIndex = questionId;

        setSurvey(oldSurvey => {
            let temp = oldSurvey.slice();
            let element = temp[oldIndex];
            temp.splice(oldIndex, 1);
            temp.splice(newIndex, 0, element);

            return temp;
        });
    }

    const moveQuestionDown = (questionId) => {
        // Go back to 0 counting
        questionId = questionId - 1;

        let newIndex = questionId + 1;
        let oldIndex = questionId;

        setSurvey(oldSurvey => {
            let temp = oldSurvey.slice();
            let element = temp[oldIndex];
            temp.splice(oldIndex, 1);
            temp.splice(newIndex, 0, element);

            return temp;
        });
    }

    return (
        <>
            <Container>
                <Row className="justify-content-center">
                    <Col className="col-md-auto rounded mt-2 mb-4">
                        <Form noValidate validated={validated} onSubmit={handleSubmit}>
                            <SurveyTitle title={title} setTitle={setTitle} alert={alert} setAlert={setAlert} />
                            {alert.length === 0 ?
                                <>
                                    <QuestionsList loading={loading} questions={survey} removeQuestion={removeQuestion} moveQuestionUp={moveQuestionUp} moveQuestionDown={moveQuestionDown} />
                                </>
                                : <></>}
                            <BottomButtons setShow={setShowModal} alert={alert} />
                            {validated ? <Redirect to='/' /> : <></>}
                        </Form>
                    </Col>
                </Row>
                <AddQuestionModal show={showModal} setShow={setShowModal} survey={survey} setSurvey={setSurvey} />
                {error ? <ErrModal error={error} setError={setError} /> : <></>}
            </Container >

        </>
    );
}

function ErrModal(props) {
    const handleClose = () => props.setError(false);

    return (
        <>
            <Modal show={props.error === false ? false : true} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title className="text-danger">Warning!</Modal.Title>
                </Modal.Header>
                <Modal.Body>{props.error}</Modal.Body>
                <Modal.Footer>
                    <Button variant="dark" onClick={handleClose}>
                        Ok, I understand
                    </Button>
                </Modal.Footer>
            </Modal>
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

function BottomButtons(props) {
    return (
        <div className="d-flex justify-content-between mt-4">
            <Link to='/'>
                <Button variant="light">Back</Button>
            </Link>
            {props.alert.length === 0 ?
                <>
                    <Button variant="outline-light" onClick={() => props.setShow(true)}>Add question</Button>
                    <Button variant="light" type="submit">Send</Button>
                </>
                :
                <></>}
        </div>
    );
}

function QuestionsList(props) {
    return (
        <>
            {(props.loading === false) && props.questions ? props.questions.map((question, index) =>
                <Question
                    key={index + 1}
                    questionId={index + 1}
                    title={question.title}
                    min={question.min}
                    max={question.max}
                    options={question.options}
                    mandatory={question.mandatory}
                    removeQuestion={props.removeQuestion}
                    length={props.questions.length}
                    moveQuestionUp={props.moveQuestionUp}
                    moveQuestionDown={props.moveQuestionDown}
                />
            ) : <></>
            }
        </>
    );
}

function Question(props) {
    return (
        <Col className="col-md-auto bg-light rounded mt-2 mb-2 justify-content-between">
            <Row className="">
                <Col className="mt-4 mb-4 rounded-pill">
                    <h3>{props.title}</h3>
                    {props.mandatory !== undefined ?
                        <OpenQuestion mandatory={props.mandatory} questionId={props.questionId} />
                        :
                        <ClosedQuestion min={props.min} max={props.max} options={props.options} questionId={props.questionId} answers={props.answers} editOrAddClosedAnswer={props.editOrAddClosedAnswer} />
                    }
                </Col>
                <Col className="col-md-auto ml-4 mt-4 rounded-pill">
                    <div className="" onClick={() => props.removeQuestion(props.questionId)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                            <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                        </svg>
                    </div>
                    {props.questionId > 1 ?
                        <div className="" onClick={() => props.moveQuestionUp(props.questionId)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z" />
                            </svg>
                        </div>
                        :
                        <></>
                    }
                    {(props.length && props.length == props.questionId) ?
                        <></>
                        :
                        <div className="" onClick={() => props.moveQuestionDown(props.questionId)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z" />
                            </svg>
                        </div>
                    }
                </Col>
            </Row>
        </Col >
    );
}

function OpenQuestion(props) {
    return (
        <Form.Group className="mb-3" controlId={props.questionId}>
            <Form.Label className="text-monospace" style={{ fontSize: "12px" }}>{props.mandatory === 1 ? "This question is mandatory" : "This question is optional"}</Form.Label>
            <Form.Control as="textarea" rows={2} value={'Open question'} disabled />
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
                                type="radio"
                                label={option.text}
                                checked="false"
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
                                checked="false"
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
    const [validated, setValidated] = useState(false);

    const [title, setTitle] = useState('');

    // States for open question
    const [mandatory, setMandatory] = useState(false);

    // States for closed question
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(1);
    const [options, setOptions] = useState([]);

    const handleClose = () => props.setShow(false);

    const handleSubmit = (event) => {
        let valid = true;
        const form = event.currentTarget;

        event.preventDefault();
        console.log(props.survey);

        if (form.checkValidity() === false) {
            event.stopPropagation();
            valid = false;
        }

        if (valid) {
            //Open question validation
            if (mandatory !== undefined) {
                props.setSurvey(oldSurvey => [...oldSurvey, { title: title, mandatory: mandatory ? 1 : 0 }]);
                setMandatory(false);
                handleClose();
                setTitle('');
            } else {
                //Closed question validation
                if (options.length >= min && options.length >= max && min <= max) {
                    props.setSurvey(oldSurvey => [...oldSurvey, { title: title, min: min, max: max, options: options }]);
                    setMin(0);
                    setMax(1);
                    setOptions([]);
                    setTitle('');
                    handleClose();
                } else {
                    // Error message
                }
            }
        }
        setValidated(true);
    };
    
    return (
        <>
            <Modal show={props.show} onHide={handleClose}>
                <Form onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add a new question</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
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
                                    <Form.Control type="text" value={title} placeholder="Type the title of the question here" className="mb-1" onChange={(td) => setTitle(td.target.value)} required />
                                    <Form.Label className="text-monospace" style={{ fontSize: "15px" }}>Is it mandatory?</Form.Label>
                                    <br></br>
                                    <Form.Check
                                        inline
                                        label="Yes"
                                        name="group2"
                                        type="radio"
                                        id={`inline-radio-3`}
                                        className="text-monospace"
                                        checked={mandatory}
                                        onChange={() => setMandatory(true)}
                                    />
                                    <Form.Check
                                        inline
                                        label="No"
                                        name="group2"
                                        type="radio"
                                        id={`inline-radio-3`}
                                        className="text-monospace"
                                        checked={mandatory === false ? true : false}
                                        onChange={() => setMandatory(false)}
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

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Back
                        </Button>
                        <Button variant="dark" type="submit">
                            Add
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
}

export default CreateSurvey;