import React, { Component } from 'react';
import queryString from 'query-string';

import API from '../../utils/API';
import SpotifyAPI from '../../utils/SpotifyAPI';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import Image from 'react-bootstrap/Image';
import Carousel from 'react-bootstrap/Carousel';

import TrackSearch from '../../components/TrackSearch';
import Player from '../../components/Player';
import ListGroup from 'react-bootstrap/esm/ListGroup';
import RoomUser from '../../components/RoomUser';

import './style.css';

import { socket } from '../../utils/Socket';

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
			userSong: {},
			item: {
				album: {
					images: [{ url: './images/playlistr-yellow-logo.png' }]
				},
				name: '',
				artists: [{ name: '' }],
				duration_ms: 0
			},
			playbackQueueStatus: 'Paused',
			progress: 0,
			roomUsers: [],
			roomHost: {},
			roomSong: {},
			alertShow: false,
			statusMsg: '',
			slides: []
		};
	}

	// When component mounts, app will connect to socket and user state will be set to response from API call. Then the playlist will be created.

	// When the current user joins room, add them to the array of current users on the server (in handler.js)
	componentDidMount() {
		SpotifyAPI.getUserData(this.state.accessToken)
			.then(res => this.setState({ user: res.data }))
			.then(() => {
				this.mountRoomSockets();
			});

		this.getCurrentlyPlaying(this.state.accessToken);

		// Queries DB for tracks added to current room
		this.setRoomTracks(this.state.roomId);
	}

	componentWillUnmount() {
		// Close connection when component unmounts
		return () => socket.disconnect();
	}

	mountRoomSockets = () => {
		// Upon connecting to socket, emit that the current user has joined current room
		socket.emit('join room', this.state.roomId, this.state.user);

		// Listen for status updates for when users join or leave room
		socket.on('user status', message => this.displayStatusMessage(message));

		// Listen for the room's current users in order to set host
		socket.on('current users', currentUsers => {
			this.setState({ roomUsers: currentUsers }, () => {
				console.log('Users in room:', this.state.roomUsers);
				this.renderAvatarSlides();

				// The first user in the usersArray is the roomHost. If the host leaves, the next person becomes the first in usersArray, becoming the roomHost
				this.setState({ roomHost: this.state.roomUsers[0] }, () => {
					// console.log('Current host: ', this.state.roomHost.display_name);
				});
			});
		});

		// Listen if other users click play/pause/next
		socket.on('player action', action => {
			if (action === 'play' || action === 'pause') {
				this.handlePlayPauseClick(action, this.state.accessToken);
			} else if (action === 'next') {
				this.handleNextClick(this.state.accessToken);
			}
		});

		// Listen if a new track gets added to the Play Queue by another user
		socket.on('new track', trackId => {
			this.addTrackToPlaybackQueue(this.state.accessToken, trackId);
			this.setRoomTracks(this.state.roomId);
		});

		// Listen for the room's current song
		socket.on('room song', song => {
			// console.log('Room song: ', song.item.name);
			this.setState({ roomSong: song });
		});
	};

	// GETs track that is currently playing on the users playback queue (Spotify), sets the state with the returned data, and then updates the Play Queue to highlight the track currently playing on the queue
	getCurrentlyPlaying = token => {
		SpotifyAPI.getUserQueueData(token)
			.then(res => {
				if (res.status === 204) throw new Error('Error: User playback queue inactive.');

				this.setState(
					{
						item: res.data.item,
						playbackQueueStatus: res.data.is_playing,
						progress: res.data.progress_ms,
						userSong: res.data
					},
					() => {
						// Set roomSong to the host's song every time getCurrentlyPlaying is called
						this.setRoomSong();
					}
				);
			})
			.then(() => this.handleQueueRender())
			.then(() => this.updatePlayedStatus())
			.catch(err => {
				if (err) {
					this.setState({ alertShow: true });
					console.log(err.message);
				}
			});
	};

	// The host sets the roomSong to what they are currently listening to
	setRoomSong = () => {
		// Object.keys checks if there are object properties - otherwise, an empty object causes errors if the host is not playing a song
		if (this.state.user.id === this.state.roomHost.id && Object.keys(this.state.userSong).length > 0) {
			this.setState({ roomSong: this.state.userSong }, () => {
				socket.emit('host song', {
					song: this.state.roomSong,
					roomId: this.state.roomId
				});
			});
		}
	};

	addTrackToPlaybackQueue = (token, trackId) => {
		SpotifyAPI.addTrackToQueue(token, trackId).catch(err => {
			if (err) console.log('Error: Unable to add track to playback queue.');
		});
	};

	setRoomTracks = roomId => {
		API.getTracks(roomId)
			.then(res => {
				this.setState({ addedTracks: res.data.addedTracks });
			})
			.catch(err => console.log(err));
	};

	// Using timeout to determine when the track is done playing
	// When time is up, we update track played status in DB and call getCurrently playing to begin the updating process again
	updatePlayedStatus = () => {
		let timeRemaining = this.state.item.duration_ms - this.state.progress;

		let trackToUpdate = this.state.item.id;

		setTimeout(() => {
			API.updateTrackPlayedStatus(this.state.roomId, trackToUpdate).catch(err => {
				if (err) console.log(err.message);
			});

			this.getCurrentlyPlaying(this.state.accessToken);
		}, timeRemaining);
	};

	// Using the state of addedTracks to conditionally render the Play Queue.
	handleQueueRender = () => {
		let addedTracks = this.state.addedTracks;

		if (!addedTracks.length) {
			return <p className="queue-help">Add a track to get started...</p>;
		} else {
			return addedTracks.map(track => (
				<ListGroup.Item
					className="play-queue-item"
					key={track._id}
					id={track.spotifyId}
					variant={this.setVariant(
						track.spotifyId,
						this.state.item.id,
						'warning',
						'dark'
					)}>
					{track.info}
				</ListGroup.Item>
			));
		}
	};

	// Emit to other users in room if you click play/pause/next
	emitPlayerAction = action => {
		socket.emit('user action', { action, roomId: this.state.roomId });
	};

	handlePlayPauseClick = (action, token) => {
		SpotifyAPI.playPausePlayback(action, token)
			.then(() => this.getCurrentlyPlaying(token))
			.catch(err => console.log(err));
	};

	// POST that changes to next song in users playback. After track is changed, we GET current playback data to update displaying track data
	handleNextClick = token => {
		SpotifyAPI.nextPlaybackTrack(token)
			.then(() =>
				API.updateTrackPlayedStatus(this.state.roomId, this.state.item.id)
				.catch(err => {
					if (err)
						throw new Error(
							'DB Error: Unable to update a track not associated with the Room.'
						);
				})
			)
			.then(() => this.getCurrentlyPlaying(token))
			.catch(err => {
				if (err) {
					this.getCurrentlyPlaying(token);
					console.log(err.message);
				}
			});
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

	// Set statusMsg to display, then remove message after timeout
	displayStatusMessage = message => {
		this.setState({ statusMsg: message.text }, () => {
			setTimeout(() => {
				this.setState({ statusMsg: '' });
			}, 1800);
		});
	};

	renderAvatarSlides = () => {
		let currentUsers = [...this.state.roomUsers];

		// Create array of slides with 3 user avatars per slide
		let allSlides = [];
		let numSlides = currentUsers.length / 3;

		for (let slideIndex = 0; slideIndex < numSlides; slideIndex++) {
			let currentSlide = [];

			for (let itemIndex = 0; itemIndex < 3; itemIndex++) {
				let user = currentUsers[itemIndex];
				if (typeof user != 'undefined') currentSlide.push(user);
			}

			// Remove first 3 users from array in order to add next 3 user to next slide, etc.
			currentUsers.splice(0, 3);

			allSlides.push(currentSlide);
		}

		this.setState({ slides: allSlides });
	};

	render() {
		return (
			<div>
				<Container className="pt-5 pb-4">
					<Row>
						{/* Logo */}
						<Col xs={12} md={2} className="text-center">
							<Image
								className="brand-logo"
								src="./images/icons/playlistr-yellow-icon.png"
							/>
						</Col>

						{/* Current Room */}
						<Col xs={12} md={4}>
							<h1>Current Room: {this.state.roomId} </h1>
						</Col>

						{/* Track Search */}
						<Col className="track-search-container" xs={12} md={6}>
							<TrackSearch
								token={this.state.accessToken}
								roomId={this.state.roomId}
								setRoomTracks={this.setRoomTracks}
								getCurrentlyPlaying={this.getCurrentlyPlaying}
								currentlyPlayingTrack={this.state.item}
								addTrackToPlaybackQueue={this.addTrackToPlaybackQueue}
							/>
						</Col>
					</Row>
				</Container>
				<Container>
					<Row>
						{/* Album Image */}
						<Col xs={6} md={6} className="text-center">
							<img
								className="now-playing-img"
								src={this.state.item.album.images[0].url}
								alt="Track album artwork"
							/>
						</Col>

						{/* Play Queue */}
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
						{/* Alert */}
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

							{/* Music Player */}
							<Player
								token={this.state.accessToken}
								item={this.state.item}
								isPlaying={this.state.isPlaying}
								progress={this.state.progress}
								emitPlayerAction={this.emitPlayerAction}
								handlePlayPauseClick={this.handlePlayPauseClick}
								handleNextClick={this.handleNextClick}
								getCurrentlyPlaying={this.getCurrentlyPlaying}
								room={this.state.roomId}
							/>
						</Col>
						<Col xs={12} sm={6} md={6}>
							{/* User Avatars */}
							<Row>
								<Carousel
									className="room-carousel"
									interval={7000}
									indicators={false}>
									{this.state.slides.map(slide => (
										<Carousel.Item>
											<Container>
												<Row>
													{slide.map(
														user => (
															<RoomUser
																key={
																	user.id
																}
																user={
																	user
																}
																avatar={
																	user
																		.images[0]
																		.url
																}
																name={
																	user.display_name
																}
															/>
														)
													)}
												</Row>
											</Container>
										</Carousel.Item>
									))}
								</Carousel>
							</Row>
							<Row>
								<p className="status-msg">{this.state.statusMsg}</p>
							</Row>
						</Col>
					</Row>
				</Container>
			</div>
		);
	}
}

export default Room;
