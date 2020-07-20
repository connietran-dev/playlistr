import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import queryString from 'query-string';

class App extends Component {
	constructor() {
		super();

		this.state = { serverData: {} };
	}

	componentDidMount() {
		let parsed = queryString.parse(window.location.search);
		let token = parsed.access_token;
		// console.log(token);

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
			<div className="App">
				<div>
					<h1>Welcome {this.state.serverData.display_name}</h1>
				</div>
				<button onClick={() => (window.location = 'http://localhost:8888/login')}>
					Login With Spotify
				</button>
			</div>
		);
	}
}

export default App;
