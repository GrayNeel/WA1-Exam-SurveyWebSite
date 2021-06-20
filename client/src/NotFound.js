import { Row, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function NotFound(props) {
    return (
      <>
        <Row className="justify-content-center">
          <h1 className="text-white mt-2">404: NOT FOUND</h1>
        </Row>
        <Row className="justify-content-center">
          <Link to={"/"}>
            <Button variant="outline-light">Back to surveys</Button>
          </Link>
        </Row>
      </>
    );
  }

  export default NotFound;