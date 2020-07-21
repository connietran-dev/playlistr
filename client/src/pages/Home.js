import React, { Component } from 'react';
import queryString from 'query-string';

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
            <div>
                <div>
                    <h1>Welcome to Playlistr, {this.state.serverData.display_name}</h1>
                </div>
            </div>
        )

    }
}

export default Home;