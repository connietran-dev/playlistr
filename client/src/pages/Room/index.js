import React, { Component } from 'react';
import queryString from 'query-string';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import TrackSearch from '../../components/TrackSearch';
import Queue from '../../components/Queue';

class Room extends Component {
	constructor() {
		super();

		let parsedUrl = queryString.parse(window.location.search);
		let token = parsedUrl.access_token;
		let roomId = parsedUrl.room_id;

		this.state = {
			user: {},
			createdPlaylist: {},
			playlistTracks: {},
			accessToken: token,
			roomId: roomId
		};
	}

	// When component mounts, user state will be set to response from API call. Then the playlist will be created.
	componentDidMount() {
		fetch('https://api.spotify.com/v1/me', {
			headers: {
				Authorization: 'Bearer ' + this.state.accessToken
			}
		})
			.then(res => res.json())
			.then(data => {
				// console.log(data);
				this.setState({ user: data });
			})
			.then(() => this.createPlaylist(this.state.user.id, this.state.roomId, this.state.accessToken));
	}

	createPlaylist = (user, room, token) => {
		// console.log('UserId: ' + user);
		console.log('Room: ' + room);
		console.log('Token: ' + token);

		fetch(`https://api.spotify.com/v1/users/${user}/playlists`, {
			method: 'POST',
			headers: {
				Authorization: 'Bearer ' + token,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name: room,
				public: false,
				collaborative: true,
				description: 'Playlistr: ' + room
			})
		})
			.then(res => res.json())
			.then(data => {
				// console.log(data);
				this.setState({ createdPlaylist: data });
			});
	};

	// GETs playlist data to maintain an update list of tracks on the playlist after a new song is added
	getPlaylistData = (token, playlistId) => {
		fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
			headers: {
				Authorization: 'Bearer ' + token
			}
		})
			.then(res => res.json())
			.then(data => {
				this.setState({ playlistTracks: data });
			});
	};

	render() {
		return (
			<div>
				<Container>
					<Row>
						<Col xs={5} md={6}>
							<h1>Current Room: {this.state.roomId} </h1>
						</Col>
						<Col xs={4} md={3}>
							<TrackSearch
								token={this.state.accessToken}
								playlistId={this.state.createdPlaylist.id}
								getPlaylistData={this.getPlaylistData}
							/>
						</Col>
						<Col xs={3} md={3}>
							<Link to="/">
								<Button className="float-right">Home</Button>
							</Link>
						</Col>
					</Row>
					<Row>
						<Col xs={8} md={6}>
							<div
								style={{
									height: '100%',
									border: '1px solid black'
								}}>
								Artwork of Track Currently Playing
							</div>
						</Col>
						<Col xs={4} md={6}>
							<Queue playlistTracks={this.state.playlistTracks} />
						</Col>
					</Row>
					<Row>
						<Col xs={12} sm={6} md={6}>
							<div>
								<h1>Now Playing</h1>
								<div
									style={{
										height: '200px',
										border: '1px solid black'
									}}>
									Music Player
								</div>
							</div>
						</Col>
						<Col xs={12} sm={6} md={6}>
							<Row className="pt-5">
								<Col md={4} xs={4}>
									<div
										style={{
											height: '100px',
											border: '1px solid black'
										}}>
										Avatar
									</div>
									<h2>{this.state.user.display_name}</h2>
								</Col>
								<Col md={4} xs={4}>
									<div
										style={{
											height: '100px',
											border: '1px solid black'
										}}>
										Avatar
									</div>
									<h2>USER</h2>
								</Col>
								<Col md={4} xs={4}>
									<div
										style={{
											height: '100px',
											border: '1px solid black'
										}}>
										Avatar
									</div>
									<h2>USER</h2>
								</Col>
							</Row>
						</Col>
					</Row>
				</Container>
			</div>
		);
	}
}

export default Room;
