import { Container, Row } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import API from './API.js';

function DoSurvey(props) {
    const [survey, setSurvey] = useState([]); 

    useEffect(() => {
        if (!props.loggedIn && props.surveyId>=0) {
          API.getSurveyById(props.surveyId).then(newS => {
            setSurvey(newS);
            props.setLoading(false);
          }).catch(err => {
            console.log(err);
            setSurvey([]);
            props.setLoading(false);
          });
        }
    
      }, [props.loggedIn, props.surveyId]);

    
    return (
        <Container>        
            <h1>{survey.title}</h1>
            {/* TODO */}
        </Container>
    );
}

export default DoSurvey;