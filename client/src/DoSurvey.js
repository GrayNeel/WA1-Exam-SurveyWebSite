import { Container, Row, Col, Button, Form, Modal } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import API from './API.js';
import { Link, Redirect } from 'react-router-dom';

function DoSurvey(props) {
  // Survey to answer
  const [survey, setSurvey] = useState([]);
  // Answers from user
  const [answers, setAnswers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState('');
  const [validated, setValidated] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!props.loggedIn && !validated) {
      API.getSurveyById(props.surveyId).then(newS => {
        setSurvey(newS);
        setLoading(false);
      }).catch(err => {
        console.log(err);
        setSurvey(undefined);
        setLoading(false);
      });
    }

  }, [props.loggedIn, props.surveyId, validated]); //put also "props" because console signal a warning

  const editOrAddOpenAnswer = (answer) => {
    // If user deletes the text, remove it from the array
    if (answer.openAnswer.length === 0) {
      setAnswers(oldAnswers => oldAnswers.filter(ans => ans.questionId !== answer.questionId));
      return;
    }

    if (answers.find(o => o.questionId === answer.questionId) !== undefined) {
      // If user is typing update
      setAnswers(oldAnswers => {
        return oldAnswers.map((as) => {
          if (as.questionId === answer.questionId)
            return { questionId: answer.questionId, openAnswer: answer.openAnswer };
          else
            return as;
        });
      });
      return;
    }
    // First type from user add answer to the array
    setAnswers(oldAnswers => [...oldAnswers, answer]);
  }

  const editOrAddClosedAnswer = (answer) => {
    // If user deselects all checkboxes, remove it from array
    if (answer.selOptions.length === 0) {
      setAnswers(oldAnswers => oldAnswers.filter(ans => ans.questionId !== answer.questionId));
    }
    // If checkboxes is already in the array, update it
    if (answers.find(o => o.questionId === answer.questionId) !== undefined) {
      setAnswers(oldAnswers => {
        return oldAnswers.map((as) => {
          if (as.questionId === answer.questionId)
            return { questionId: answer.questionId, selOptions: answer.selOptions };
          else
            return as;
        });
      })
    } else {
      // Otherwise, add it to the array
      setAnswers(oldAnswers => [...oldAnswers, answer]);
    }
  }

  const handleSubmit = (event) => {
    let valid = true;
    const form = event.currentTarget;

    event.preventDefault();


    if (form.checkValidity() === false) {
      event.stopPropagation();
      valid = false;
    }
    else {
      // Check if minimum answers for closed questions is satisfied
      survey.questions.forEach(q => {
        // Search for the mandatory open questions
        if (q.mandatory !== undefined && q.mandatory === 1) {
          let ans = answers.find(o => o.questionId === q.questionId);
          // If not present, user didn't answer to mandatory question
          if (ans === undefined) {
            event.stopPropagation();
            valid = false;
          }
        }
        //Search for closed required questions 
        if (q.min !== undefined && q.min > 0) {
          let ans = answers.find(o => o.questionId === q.questionId);
          // if it is not present or > max, it is not valid
          console.log("CLOSED QUESTION MANDATORY: " + ans);
          if (ans === undefined || ans.selOptions.length > q.max) {
            event.stopPropagation();
            valid = false;
          }
        }
      });

    }
    if (valid) {
      let res = { name: name, answers: answers };
      API.addNewAnswer(res, survey.surveyId);
      setValidated(true);
      setError(false);
    } else {
      console.log("HEERE");
      setError(true);
    }
  };

  return (
    <>
      {survey.err ?
        <NotFound setLoading={setLoading} />
        :
        loading === true ? <></> :
          <Container>
            <SurveyTitle title={survey.title} />
            <Row className="justify-content-center">
              <Col className="col-md-auto rounded mt-2 mb-4">
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <NameBox name={name} setName={setName} alert={alert} setAlert={setAlert} />
                  {(alert.length === 0 && name.length > 2) ? <QuestionsList loading={loading} questions={survey.questions} answers={answers} editOrAddOpenAnswer={editOrAddOpenAnswer} editOrAddClosedAnswer={editOrAddClosedAnswer} /> : <></>}
                  <EndingButtons name={name} alert={alert} />
                  {validated ? <Redirect to='/' /> : <></>}
                </Form>
              </Col>
            </Row>
          </Container >
      }
      {error ? <ErrModal error={error} setError={setError} /> : <></>}

    </>
  );
}

function ErrModal(props) {
  const handleClose = () => props.setError(false);

  return (
    <>
      <Modal show={props.error} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">Warning!</Modal.Title>
        </Modal.Header>
        <Modal.Body>Some required answers are missing, please check again your answers.</Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={handleClose}>
            Ok, I understand
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

function NameBox(props) {

  const validateName = (name) => {
    if (name.length === 0) {
      props.setName('');
      props.setAlert('');
    } else
      if (!/[^a-zA-Z]/.test(name)) {
        props.setName(name);
        props.setAlert('');
      } else
        props.setAlert("Invalid name");
  }

  return (
    <Col className="col-md-auto bg-light rounded mt-2 mb-2 ">
      <Row className="">
        <Col className="col-md-auto mt-4 mb-4 rounded-pill">
          <h3>Insert your name</h3>
          <Form.Control type="text" placeholder="Insert name here" onChange={td => validateName(td.target.value)} required />
          <Form.Label className="text-danger">{props.alert}</Form.Label>
        </Col>
      </Row>
    </Col>
  );
}

function NotFound(props) {
  return (
    <>
      <Row className="justify-content-center">
        <h1 className="text-white mt-2">404: NOT FOUND</h1>
      </Row>
      <Row className="justify-content-center">
        <Link to={"/"}>
          <Button variant="outline-light" >Back to surveys</Button>
        </Link>
      </Row>
    </>
  );
}

function EndingButtons(props) {
  return (
    <div className="d-flex justify-content-between mt-4">
      <Link to="/">
        <Button variant="outline-light">Back to surveys</Button>
      </Link>
      {(props.alert.length === 0 && props.name.length > 2) ? <Button type="submit" variant="outline-light">Send Answers</Button> : <></>}
    </div>
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
          editOrAddOpenAnswer={props.editOrAddOpenAnswer}
          editOrAddClosedAnswer={props.editOrAddClosedAnswer}
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
            <OpenQuestion mandatory={props.mandatory} questionId={props.questionId} answers={props.answers} editOrAddOpenAnswer={props.editOrAddOpenAnswer} />
            :
            <ClosedQuestion min={props.min} max={props.max} options={props.options} questionId={props.questionId} answers={props.answers} editOrAddClosedAnswer={props.editOrAddClosedAnswer} />
          }
        </Col>
      </Row>
    </Col>
  );
}

function OpenQuestion(props) {
  const actualAnswer = props.answers.find(o => o.questionId === props.questionId);
  return (
    <Form.Group className="mb-3" controlId={props.questionId}>
      <Form.Label className="text-monospace" style={{ fontSize: "12px" }}>{props.mandatory === 1 ? "This question is mandatory" : "This question is optional"}</Form.Label>
      {props.mandatory === 1 ?
        <Form.Control as="textarea" rows={5} value={actualAnswer ? actualAnswer.openAnswer : ''} onChange={td => props.editOrAddOpenAnswer({ questionId: props.questionId, openAnswer: td.target.value })} required />
        :
        <Form.Control as="textarea" rows={5} value={actualAnswer ? actualAnswer.openAnswer : ''} onChange={td => props.editOrAddOpenAnswer({ questionId: props.questionId, openAnswer: td.target.value })} />
      }
    </Form.Group>
  );
}

function ClosedQuestion(props) {

  // Counter that tells how many answers the user gave to the question
  let givenAnsw = props.answers.find(o => o.questionId === props.questionId);
  if (givenAnsw !== undefined) {
    givenAnsw = givenAnsw.selOptions.length;
  } else {
    givenAnsw = 0;
  }

  const checkSingleAnswer = (checked, optionId, questionId) => {

    // Add/Update it
    props.editOrAddClosedAnswer({ questionId: questionId, selOptions: [optionId] });
  }

  const checkMultipleAnswer = (checked, optionId, questionId) => {

    const selQuestion = props.answers.find(o => o.questionId === props.questionId);

    if (checked) {
      //if it is the first answer to the question, add it
      if (selQuestion === undefined)
        props.editOrAddClosedAnswer({ questionId: questionId, selOptions: [optionId] });

      //Otherwise check if it is possible to add the answer
      else if (selQuestion.selOptions.length < props.max)
        props.editOrAddClosedAnswer({ questionId: questionId, selOptions: [...selQuestion.selOptions, optionId] });
    } else {
      // User unchecked, so remove is needed
      const newOpt = selQuestion.selOptions.filter(opt => opt !== optionId);
      console.log("NEW: " + newOpt);
      props.editOrAddClosedAnswer({ questionId: questionId, selOptions: newOpt });
    }
  }

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
                onChange={event => checkSingleAnswer(event.target.checked, option.optionId, option.questionId)}
              />
            )}
          </Form.Group>
          {givenAnsw < props.min ? <span className="text-monospace text-danger" style={{ fontSize: "12px" }}>Minimum answers: {props.min} </span> : <span className="text-monospace text-success" style={{ fontSize: "12px" }}>Minimum answers: {props.min} </span>}
          <br></br>
          {givenAnsw > props.max ? <span className="text-monospace text-danger" style={{ fontSize: "12px" }}>Maximum answers: {props.max} </span> : <span className="text-monospace text-success" style={{ fontSize: "12px" }}>Maximum answers: {props.max} </span>}
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
                onChange={event => checkMultipleAnswer(event.target.checked, option.optionId, option.questionId)}
                checked={props.answers.find(o => o.questionId === props.questionId) !== undefined ?
                  props.answers.find(o => o.questionId === props.questionId).selOptions.find(op => op === option.optionId) !== undefined ? true : false
                  :
                  false
                }
              />
            )}
          </Form.Group>
          {givenAnsw < props.min ? <span className="text-monospace text-danger" style={{ fontSize: "12px" }}>Minimum answers: {props.min} </span> : <span className="text-monospace text-success" style={{ fontSize: "12px" }}>Minimum answers: {props.min} </span>}
          <br></br>
          {givenAnsw > props.max ? <span className="text-monospace text-danger" style={{ fontSize: "12px" }}>Maximum answers: {props.max} </span> : <span className="text-monospace text-success" style={{ fontSize: "12px" }}>Maximum answers: {props.max} </span>}
        </>
      }
    </>
  );
}

export default DoSurvey;