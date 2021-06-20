import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import API from './API.js';

function DoSurvey(props) {
  const [survey, setSurvey] = useState([]);

  useEffect(() => {
    if (!props.loggedIn) {
      API.getSurveyById(props.surveyId).then(newS => {
        setSurvey(newS);
        props.setLoading(false);
      }).catch(err => {
        console.log(err);
        setSurvey(undefined);
        props.setLoading(false);
      });
    }

  }, [props.loggedIn]); //put also "props" because console signal a warning

  return (
    <>
      {survey.err ?
        <NotFound setLoading={props.setLoading} />
        :
        <Container>
          <Row className="justify-content-center">
            <SurveyTitle title={survey.title} />
            <Col className="col-md-auto rounded mt-2">
              <NameBox />
              <QuestionsList questions={survey.questions} />
              <EndingButtons setLoading={props.setLoading} />
            </Col>
          </Row>
        </Container >
      }

    </>
  );
}

function NameBox(props) {
  return (
    <Col className="col-md-auto bg-light rounded mt-2 mb-2 ">
      <Row className="">
        <Col className="col-md-auto mt-4 mb-4 rounded-pill">
          <h3>Insert your name</h3>
          <Form>
            <Form.Control type="text" placeholder="Insert name here" />
          </Form>
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
        <Button variant="outline-light" onClick={e => { props.setLoading(true); window.location.href = '/'; }}>Back to surveys</Button>
      </Row>
    </>
  );
}

function EndingButtons(props) {
  return (
    <div className="d-flex justify-content-between mt-4">
      <Button variant="outline-light" onClick={e => { props.setLoading(true); window.location.href = '/'; }}>Back to surveys</Button>
      <Button variant="outline-light">Send Answers</Button>
    </div>
  );
}

function SurveyTitle(props) {
  return (
    <>
      <h1 className="text-white mt-2">{props.title}</h1>
    </>
  );
}

function QuestionsList(props) {
  return (
    <>
      {props.questions ? props.questions.map(question =>
        <Question
          key={question.questionId}
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
            <OpenQuestion mandatory={props.mandatory} />
            :
            <ClosedQuestion min={props.min} max={props.max} options={props.options} />
          }
        </Col>
      </Row>
    </Col>
  );
}

function OpenQuestion(props) {
  return (
    <Form>
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>{props.mandatory===1 ? "This question is mandatory" : "This question is optional"}</Form.Label>
        <Form.Control as="textarea" rows={5} />
      </Form.Group>
    </Form>
  );
}

function ClosedQuestion(props) {
  return (
    <>
      {props.max === 1 ?
        <Form className="ml-3">
          {props.options.map(option =>
            <Form.Check
              type={'radio'}
              id={option.optionId}
              label={option.text}
            />
          )}
        </Form>
        :
        <Form className="ml-3">
          {props.options.map(option =>
            <Form.Check
              type={'checkbox'}
              id={option.optionId}
              label={option.text}
            />
          )}
        </Form>
      }
    </>
  );
}

export default DoSurvey;