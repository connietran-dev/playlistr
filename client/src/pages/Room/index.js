import React, { Component } from 'react';
import queryString from 'query-string';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';

import TrackSearch from '../../components/TrackSearch';
import Player from '../../components/Player';
import ListGroup from 'react-bootstrap/esm/ListGroup';
import RoomUser from '../../components/RoomUser';

import './style.css';

import apiUrl from '../../apiConfig';
import socketIOClient from 'socket.io-client';

const ENDPOINT = apiUrl;

class Room extends Component {
	constructor() {
		super();

		let parsedUrl = queryString.parse(window.location.search);
		let token = parsedUrl.access_token;
		let roomId = parsedUrl.room_id;

		this.state = {
			user: {},
			addedTracks: [],
			accessToken: token,
			roomId: roomId,
			item: {
				album: {
					images: [{ url: './images/logo.jpg' }]
				},
				name: '',
				artists: [{ name: '' }],
				duration_ms: 0
			},
			playbackQueueStatus: 'Paused',
			progress: 0,
			roomUsers: [],
			alertShow: false
		};
	}

	// When component mounts, app will connect to socket and user state will be set to response from API call. Then the playlist will be created.

	// When the current user creates & joins the room, add them to the array of current users on the server (in handler.js)
	// When another user joins the existing room, they're also added to the array
	// (TODO) All users then need to see users already in the room
	componentDidMount() {
		fetch('https://api.spotify.com/v1/me', {
			headers: {
				Authorization: 'Bearer ' + this.state.accessToken
			}
		})
			.then(res => res.json())
			.then(data => {
				this.setState({ user: data });
			})
			.then(() => {
				this.joinRoomSockets();
			});

		this.getCurrentlyPlaying(this.state.accessToken);
	}

	componentWillUnmount() {
		let socket = socketIOClient(ENDPOINT);

		// Close connection when component unmounts
		return () => socket.disconnect();
	}

	joinRoomSockets = () => {
		// Connect to socket
		let socket = socketIOClient(ENDPOINT);

		// Upon connecting to socket, emit that the current user has joined current room
		socket.on('connect', () => {
			socket.emit('join room', this.state.roomId, this.state.user);
		});

		// Listen for status updates for when users join or leave room
		socket.on('user status', message => {
			console.log('Status update: ', message);
		});

		// Listen for the room's current users
		socket.on('current users', users => {
			this.setState({ roomUsers: users }, () => {
				console.log('Users in room:', this.state.roomUsers);
			});
		});
	};

	addTrackToDisplayQueue = (roomId, trackId, trackInfo) => {
		let updatedTrackList = this.state.addedTracks;

		console.log(this.state.item.id);

		updatedTrackList.push({
			room: roomId,
			id: trackId,
			info: trackInfo
		});

		this.setState({ addedTracks: updatedTrackList }, () => {
			console.log('Added Tracks State:');
			console.log(this.state.addedTracks);
		});
	};

	// GETs track that is currently playing on the users playback queue (Spotify), sets the state with the returned data, and then updates the Play Queue to highlight the track currently playing on the queue
	getCurrentlyPlaying = token => {
		fetch('https://api.spotify.com/v1/me/player', {
			headers: {
				Authorization: 'Bearer ' + token
			}
		})
			.then(res => res.json())
			.then(data => {
				this.setState({
					item: data.item,
					playbackQueueStatus: data.is_playing,
					progress: data.progress_ms
				});
			})
			.then(() => this.handleQueueRender())
			.catch(err => {
				if (err) {
					this.setState({ alertShow: true });
				}
			});
	};

	// Using the state of addedTracks to conditionally render the Play Queue.
	handleQueueRender = () => {
		let addedTracks = this.state.addedTracks;

		if (!addedTracks.length) {
			return <p>Add a track to get started...</p>;
		} else {
			return addedTracks.map(track => (
				<ListGroup.Item
					className="play-queue-item"
					key={track.id}
					variant={this.setVariant(track.id, this.state.item.id, 'warning', 'dark')}>
					{track.info}
				</ListGroup.Item>
			));
		}
	};

	// Helper method that compares two id's and sets a variant based on result
	setVariant = (id, comparedId, variantA, variantB) => {
		if (id === comparedId) return variantA;
		return variantB;
	};

	handleAlertClick = () => {
		this.getCurrentlyPlaying(this.state.accessToken);

		this.setState({ alertShow: false });
	};

	render() {
		return (
			<div>
				<Container className="py-3">
					<Row>
						<Col xs={12} md={6}>
							<h1>Current Room: {this.state.roomId} </h1>
						</Col>
						<Col xs={12} md={6}>
							<TrackSearch
								token={this.state.accessToken}
								roomId={this.state.roomId}
								addTrackToDisplayQueue={this.addTrackToDisplayQueue}
								getCurrentlyPlaying={this.getCurrentlyPlaying}
								currentlyPlayingTrack={this.state.item}
							/>
						</Col>
					</Row>
				</Container>
				<Container>
					<Row>
						<Col xs={6} md={6}>
							<img
								className="now-playing-img"
								src={this.state.item.album.images[0].url}
								alt="Track album artwork"
							/>
						</Col>
						<Col xs={6} md={6}>
							<div className="play-queue">
								<h1>Play Queue</h1>

								<ListGroup className="play-queue-list">
									{this.handleQueueRender()}
								</ListGroup>
							</div>
						</Col>
					</Row>
				</Container>
				<Container>
					<Row>
						<Col xs={12} sm={6} md={6}>
							<Alert show={this.state.alertShow} variant="success">
								<h5>
									Please open the Spotify App and play a track to
									get started.
								</h5>

								<div className="d-flex justify-content-end">
									<button
										onClick={() => this.handleAlertClick()}
										variant="outline-success">
										Ready
									</button>
								</div>
							</Alert>
							<Player
								token={this.state.accessToken}
								item={this.state.item}
								isPlaying={this.state.isPlaying}
								progress={this.state.progress}
								getCurrentlyPlaying={this.getCurrentlyPlaying}
							/>
						</Col>
						<Col xs={12} sm={6} md={6}>
							<Row className="pt-5">
								{this.state.roomUsers.map(user => (
									<RoomUser
										key={user.id}
										user={user}
										avatar={user.images[0].url}
										name={user.display_name}
									/>
								))}
							</Row>
						</Col>
					</Row>
				</Container>
			</div>
		);
	}
}

export default Room;
