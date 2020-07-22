import React, { Component } from 'react';
import queryString from 'query-string';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Playlist from '../../components/Playlist';
import RoomButtons from '../../components/RoomButtons';

import './style.css';

class Home extends Component {
	constructor() {
		super();

		this.state = {
			user: {},
			playlists: [],
			accessToken: ''
		};
	}

	componentDidMount() {
		let parsed = queryString.parse(window.location.search);
		let token = parsed.access_token;

		this.setState({ accessToken: token });

		// Fetch user data
		fetch('https://api.spotify.com/v1/me', {
			headers: {
				Authorization: 'Bearer ' + token
			}
		})
			.then(res => res.json())
			.then(data => {
				console.log(data);
				this.setState({ user: data });
			});

		// Fetch playlists
		fetch('https://api.spotify.com/v1/me/playlists?limit=8', {
			headers: { Authorization: 'Bearer ' + token }
		})
			.then(res => res.json())
			.then(playlistData => {
				let playlists = playlistData.items;
				// If playlist image is undefined, create placeholder image
				playlists.map(item => {
					if (item.images[0] === undefined) {
						item.images.push({
							url: 'https://via.placeholder.com/200'
						});
					}
				});
				this.setState({ playlists: playlists });
			});
	}

	render() {
		return (
			<div>
				<Container>
					<Row>
						<Col xs={8}>
							<h1>Welcome to Playlistr, {this.state.user.display_name}</h1>
						</Col>
						<Col>
							<input placeholder="Search" />
							<i class="fa fa-search" aria-hidden="true"></i>
						</Col>
					</Row>
				</Container>
				<Container>
					<Row>
						{this.state.playlists.map(playlist => (
							<Playlist
								key={playlist.id}
								image={playlist.images[0].url}
								link={playlist.owner.external_urls.spotify}
								name={playlist.name}
							/>
						))}
					</Row>
				</Container>
				<Container>
					<Row>
						<Col>
							<RoomButtons
								token={this.state.accessToken}
								userId={this.state.user.id}
							/>
						</Col>
					</Row>
				</Container>
			</div>
		);
	}
}

export default Home;
