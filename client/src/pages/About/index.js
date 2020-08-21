import React from 'react';
import { Link } from 'react-router-dom';

import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';

import './style.css';

function About() {
    return (
        <Jumbotron fluid>
            <Container>
                <h1 className="brand-name">Playlistr</h1>
                <p>
                    This is a modified jumbotron that occupies the entire horizontal space of
                    its parent.
                </p>
                <Image roundedCircle className="login about brand-logo" src="./images/logo.jpg" />
                <Row>
                    <Link to="/">
                        Back Home
                </Link>
                </Row>
            </Container>
        </Jumbotron>

    )
}

export default About;