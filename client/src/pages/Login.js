import React from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function Login() {
    return (
        <Container>
            <Row>
                <Col>
                    <h1>Welcome to Playlistr</h1>
                    <h3>To continue, log in to Spotify</h3>
                    <button onClick={() => {
                        window.location = window.location.href.includes('localhost')
                            ? 'http://localhost:8888/spotify/login'
                            : 'https://playlistr-io.herokuapp.com/spotify/login'
                    }}>
                        Sign in with Spotify
                </button>
                </Col>
            </Row>
        </Container>
    )
}

export default Login;