import NotFound from './NotFound.js';
import { Container, Col, Row, Button, Form } from 'react-bootstrap';
import {  Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import API from './API.js';

function ShowAnswers(props) {
    // Survey questions
    const [survey, setSurvey] = useState([]);
    // Answers from user
    const [answers, setAnswers] = useState([]);
    // Counter to navigate through answers
    const [counter, setCounter] = useState(0);

    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        // if user is logged
        if (props.loggedIn && survey.title === undefined) {
            // get questions from surveyId
            API.getSurveyById(props.surveyId).then(newS => {
                setSurvey(newS);

                // then get answers to that survey
                API.getAnswersOfSurvey(props.surveyId).then(newA => {
                    setAnswers(newA);
                    setLoading(false);
                }).catch(err => {
                    console.log(err);
                    setSurvey([]);
                    setAnswers([]);
                    setLoading(false);
                });
            }).catch(err => {
                console.log(err);
                setSurvey([]);
                setLoading(false);
            });
        }

    }, [props.loggedIn, props.surveyId, survey.title]);

    return (
        <>
            {survey.err ?
                <NotFound setLoading={setLoading} />
                :
                (loading === true || answers === undefined) ? <></> :
                    <Container>
                        <SurveyTitle title={survey.title} />
                        <Row className="justify-content-center">
                            <Col className="col-md-auto rounded mt-2 mb-4">
                                <UpButtons counter={counter} setCounter={setCounter} length={answers.length} />
                                <Form>
                                    <NameBox answers={answers[counter]} />
                                    {answers.length > 0 ? <QuestionsList questions={survey.questions} answers={answers[counter].answers} /> : <></>}
                                </Form>
                                <Row className="justify-content-center pt-1">
                                    <Link to="/">
                                        <Button variant="outline-light">Back to surveys</Button>
                                    </Link>
                                </Row>
                            </Col>
                        </Row>
                    </Container>
            }
        </>
    );
}

function QuestionsList(props) {
    return (
        <>
            {props.questions ? props.questions.map(question =>
                <Question
                    key={question.questionId}
                    questionId={question.questionId}
                    title={question.title}
                    min={question.min}
                    max={question.max}
                    options={question.options}
                    mandatory={question.mandatory}
                    answers={props.answers}
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
            <Form.Control as="textarea" rows={4} value={actualAnswer ? actualAnswer.openAnswer : ''} disabled />
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

function UpButtons(props) {
    return (
        <>
            <div className="d-flex justify-content-between mt-4">
                {props.counter > 0 ? <Button variant="outline-light" onClick={() => props.setCounter(old => old - 1)}>Previous</Button> : <Button variant="outline-light" className="invisible" onClick={() => props.setCounter(old => old - 1)}>Previous</Button>}
                <h4 className="text-white">Answer {props.counter + 1}</h4>
                {props.counter < props.length - 1 ? <Button variant="outline-light" onClick={() => props.setCounter(old => old + 1)}>Next</Button> : <Button variant="outline-light" className="invisible" onClick={() => props.setCounter(old => old + 1)}>Next</Button>}
            </div>
        </>
    );
}

function NameBox(props) {
    return (
        <Col className="col-md-auto bg-light rounded mt-2 mb-2 ">
            <Row className="">
                <Col className="col-md-auto mt-4 mb-4 rounded-pill">
                    <h3>Insert your name</h3>
                    <Form.Control type="text" value={props.answers.name} disabled />
                </Col>
            </Row>
        </Col>
    );
}

function SurveyTitle(props) {
    return (
        <>
            <Row className="justify-content-center">
                <h1 className="text-white mt-2">{props.title}</h1>
            </Row>
        </>
    );
}

export default ShowAnswers;