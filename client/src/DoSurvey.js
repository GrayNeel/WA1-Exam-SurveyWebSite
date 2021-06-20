import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import API from './API.js';
import { BrowserRouter as Router, Route, Switch, Redirect, Link } from 'react-router-dom';

function DoSurvey(props) {
  const [survey, setSurvey] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [alert, setAlert] = useState('');
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    if (!props.loggedIn) {
      API.getSurveyById(props.surveyId).then(newS => {
        setSurvey(newS);
        setLoading(false);
      }).catch(err => {
        console.log(err);
        setSurvey(undefined);
        setLoading(false);
      });
    }

  }, [props.loggedIn]); //put also "props" because console signal a warning

  const handleSubmit = (event) => {
    event.preventDefault();

    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    else {
      //props.handleAddOrEdit();
      console.log(form);
    }
    setValidated(true);

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
                  {(alert.length == 0 && name.length > 2) ? <QuestionsList loading={loading} questions={survey.questions} /> : <></>}
                  <EndingButtons name={name} alert={alert} />
                </Form>
              </Col>
            </Row>
          </Container >
      }

    </>
  );
}

function NameBox(props) {

  const validateName = (name) => {
    if (name.length == 0) {
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
      {(props.alert.length == 0 && props.name.length > 2) ? <Button type="submit" variant="outline-light">Send Answers</Button> : <></>}
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
            <OpenQuestion mandatory={props.mandatory} questionId={props.questionId} />
            :
            <ClosedQuestion min={props.min} max={props.max} options={props.options} questionId={props.questionId} />
          }
        </Col>
      </Row>
    </Col>
  );
}

function OpenQuestion(props) {
  const [openAnswer, setOpenAnswer] = useState('');
  return (
    <Form.Group className="mb-3" controlId={props.questionId}>
      <Form.Label className="text-monospace" style={{ fontSize: "12px" }}>{props.mandatory === 1 ? "This question is mandatory" : "This question is optional"}</Form.Label>
      {props.mandatory === 1 ?
        <Form.Control as="textarea" rows={5} value={openAnswer} onChange={td => setOpenAnswer(td.target.value)} required />
        :
        <Form.Control as="textarea" rows={5} value={openAnswer} onChange={td => setOpenAnswer(td.target.value)} />
      }
    </Form.Group>
  );
}

function ClosedQuestion(props) {
  return (
    <>
      {props.max === 1 ?
        <>
          {props.min === 1 ?
            // Single answer required
            <Form.Group className="ml-3" controlId={props.questionId}>
              <br></br>
              {props.options.map(option =>
                <Form.Check
                  type={'radio'}
                  key={option.optionId}
                  id={option.optionId}
                  name={option.questionId}
                  label={option.text}
                  required
                />
              )}
            </Form.Group>
            :
            // Single answer but not required
            <Form.Group className="ml-3" controlId={props.questionId}>
              <br></br>
              {props.options.map(option =>
                <Form.Check
                  type={'radio'}
                  key={option.optionId}
                  id={option.optionId}
                  name={option.questionId}
                  label={option.text}
                />
              )}
            </Form.Group>
          }
          <span className="text-monospace" style={{ fontSize: "12px" }}>Minimum answers: {props.min}<br></br>Maximum answers: {props.max} </span>
        </>
        :
        <>
          {props.min === 1 ?
            // Multiple answers but at least one is required  
            //TODO: make at least one required
            <Form.Group className="ml-3" >
              <br></br>
              {props.options.map(option =>
                <Form.Check
                  type={'checkbox'}
                  key={option.optionId}
                  id={option.optionId}
                  label={option.text}
                />
              )}
            </Form.Group>
            :
            // Multiple answers none is required
            <Form.Group className="ml-3">
              <br></br>
              {props.options.map(option =>
                <Form.Check
                  type={'checkbox'}
                  key={option.optionId}
                  id={option.optionId}
                  label={option.text}
                />
              )}
            </Form.Group>
        }
          <span className="text-monospace" style={{ fontSize: "12px" }}>Minimum answers: {props.min}<br></br>Maximum answers: {props.max} </span>
        </>
      }
    </>
  );
}

export default DoSurvey;