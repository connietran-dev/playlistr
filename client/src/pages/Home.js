import React, { Component } from 'react';
import queryString from 'query-string';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class Home extends Component {
    constructor() {
        super();

        this.state = { serverData: {} };
    }

    componentDidMount() {
        let parsed = queryString.parse(window.location.search);
        let token = parsed.access_token;

        fetch('https://api.spotify.com/v1/me', {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                this.setState({ serverData: data });
            });
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col xs={8}>
                        <h1>Welcome to Playlistr, {this.state.serverData.display_name}</h1>
                    </Col>
                    <Col>
                        <input
                            placeholder="Search a track"
                        />
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default Home;