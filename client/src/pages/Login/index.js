import React from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';

import './style.css';

function Login() {
    return (
        <Container fluid>
            <Row>
                <Col>
                    <div className="backdrop login text-center">
                        <h1 className="brand-name">Playlistr</h1>
                        <Image roundedCircle className="brand-logo" src="./images/logo.jpg" />
                    </div>
                </Col>
            </Row>
            <Row>
                <Col>
                    <div className="login-div text-center">
                        <h5>To continue, log in to your Spotify account</h5>
                        <button onClick={() => {
                            window.location = window.location.href.includes('localhost')
                                ? 'http://localhost:8888/api/spotify/login'
                                : '/api/spotify/login'
                        }}>Sign in with Spotify
                        </button>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default Login;