import React, { Component } from 'react';
import queryString from 'query-string';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import RoomButtons from '../../components/RoomButtons';

import './style.css';

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

		// Fetch playlists
		fetch('https://api.spotify.com/v1/me/playlists', {
			headers: { Authorization: 'Bearer ' + token }
		})
			.then(res => res.json())
			.then(playlistData => {
				let playlists = playlistData.items;
				// If playlist image is undefined, create placeholder image
				playlists.map(item => {
					if (item.images[0] === undefined ) {
						item.images.push("https://via.placeholder.com/200")
					}
				})
				console.log(playlists);
				this.setState({
					playlists: playlists.map(item => {
						return {
							name: item.name,
							imageUrl: item.images[0].url
						};
					})
				});
			});
	}

	render() {
		return (
			<div>
				<Container>
					<Row>
						<Col xs={8}>
							<h1>
								Welcome to Playlistr,{' '}
								{this.state.serverData.display_name}
							</h1>
						</Col>
						<Col>
							<input placeholder="Search a track" />
						</Col>
					</Row>
					<Row>
						<Col xs={6} md={3}>
							<div
								style={{
									height: '150px',
									width: '150px',
									border: '1px solid black'
								}}
								color="red">
								Playlist
							</div>
						</Col>
						<Col xs={6} md={3}>
							<div
								style={{
									height: '150px',
									width: '150px',
									border: '1px solid black'
								}}
								color="red">
								Playlist
							</div>
						</Col>
						<Col xs={6} md={3}>
							<div
								style={{
									height: '150px',
									width: '150px',
									border: '1px solid black'
								}}
								color="red">
								Playlist
							</div>
						</Col>
						<Col xs={6} md={3}>
							<div
								style={{
									height: '150px',
									width: '150px',
									border: '1px solid black'
								}}
								color="red">
								Playlist
							</div>
						</Col>
						<Col xs={6} md={3}>
							<div
								style={{
									height: '150px',
									width: '150px',
									border: '1px solid black'
								}}
								color="red">
								Playlist
							</div>
						</Col>
					</Row>
				</Container>
				<Container>
					<Row>
						<Col>
							<RoomButtons />
						</Col>
					</Row>
				</Container>
			</div>
		);
	}
}

export default Home;
