import { Form, Button, Alert, Col, Row, Container, Card } from 'react-bootstrap';

import { Link } from 'react-router-dom';
import { useState } from 'react';

function LoginForm(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [validated, setValidated] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrorMessage('');
        const credentials = { username, password };

        let valid = true;
        if (username === '' || password === '' || password.length < 6)
            valid = false;

        if (valid) {
            props.login(credentials).catch((err) => { setErrorMessage(err) });
        }
        else {
            // show a better error message...
            setErrorMessage('Error(s) in the form, please try again.')
        }
        setValidated(true);   // "I've completed my works, please show me your validation result"
    };

    return (
        <>
            <Container>
                <Row className="justify-content-md-center mt-5 pt-5 ml-3">
                    <Card
                        bg={'dark'}
                        key={1}
                        text={'white'}
                        style={{ width: '18rem' }}
                        className="mb-2 justify-content-md-center"
                    >
                        <Card.Header><b>Login to start writing your own survey!</b></Card.Header>
                        <Card.Body>
                            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                {errorMessage ? <Alert variant='danger'>{errorMessage}</Alert> : ''}
                                <Form.Group controlId='username'>
                                    <Form.Label>email</Form.Label>
                                    <Form.Control required type='email' placeholder="Insert email here" value={username} onChange={ev => setUsername(ev.target.value)} />
                                </Form.Group>
                                <Form.Group controlId='password'>
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control required type='password' placeholder="Insert password here" value={password} onChange={ev => setPassword(ev.target.value)} />
                                </Form.Group>
                                <Row className="justify-content-between pl-3 pr-3">
                                    <Button variant="outline-light" type="submit">Login</Button>
                                    <Link to="/">
                                        <Button variant="outline-secondary">Back</Button>
                                    </Link>
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>
                </Row>
            </Container>
        </>)
}

function LogoutButton(props) {
    return (
        <Col>
            <Button variant="outline-primary" onClick={props.logout}>Logout</Button>
        </Col>
    )
}

export { LoginForm, LogoutButton };