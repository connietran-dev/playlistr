import React, { Component, useState, useEffect } from 'react';
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
import apiUrl from '../../apiConfig';

import spotifyHelpers from '../../utils/spotifyHelpers';
import configureSlides from '../../utils/configureSlides';
import utils from './utils';
import './style.css';

// import { socket } from '../../utils/Socket';

const Room = props => {
	const parsedUrl = queryString.parse(props.location.search);
	const token = parsedUrl.access_token;
	const roomId = parsedUrl.room_id;

	const [user, setUser] = useState(null);
	const [queueTracks, setQueueTracks] = useState(null);
	// const [userSong, setUserSong] = useState(null);
	const [roomUsers, setRoomUsers] = useState([]);
	// const [roomHost, setRoomHost] = useState(null);
	// const [roomTrack, setRoomTrack] = useState(null);
	const [slides, setSlides] = useState(null);
	// const [alertShow, setAlertShow] = useState(false);
	const [leaveRoomAlert, setLeaveRoomAlert] = useState(false);
	// const [statusMsg, setStatusMsg] = useState(null);
	const [trackPlaying, setTrackPlaying] = useState(true);
	const [queueTrigger, setQueueTrigger] = useState(false);

	const [track, setTrack] = useState({
		name: '',
		albumImages: [],
		artists: [],
		duration: 0,
		progress: 0
	});

	const handleUser = async token => {
		try {
			const currentUser = await spotifyHelpers.user(token);
			// socket.emit('join room', roomId, currentUser);
			setUser(currentUser);
			setRoomUsers([currentUser]);
		} catch (err) {
			console.log(err);
		}
	};

	const handleCurrentlyPlaying = async token => {
		const { trackData, isPlaying, timeRemaining } = await utils.getCurrentTrack(
			token
		);

		if (trackData) {
			setTrack(trackData);
			setTrackPlaying(isPlaying);

			setTimeout(() => {
				handleCurrentlyPlaying(token);
			}, timeRemaining);
		} else setTrackPlaying(false);
	};

	const handleRoomTracks = async id => {
		try {
			const { data } = await API.getTracks(id);

			if (data && data.addedTracks[0]) {
				setQueueTracks(data.addedTracks);
			}
		} catch (err) {
			console.log(err);
		}
	};

	const renderAvatarSlides = () => {
		const currentUsers = [...roomUsers];
		setSlides(configureSlides(currentUsers, 3));
	};

	useEffect(() => {
		if (token && roomId) {
			handleUser(token);
			handleCurrentlyPlaying(token);
		}
	}, []);

	useEffect(() => {
		if (roomId) handleRoomTracks(roomId);
	}, [queueTrigger]);

	useEffect(renderAvatarSlides, [roomUsers]);

	return roomId && user && token ? (
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
					<Col className="room-title" xs={12} md={4}>
						<h1>Current Room: {roomId} </h1>
					</Col>

					{/* Track Search */}
					<Col className="track-search-container" xs={12} md={6}>
						<TrackSearch
							token={token}
							roomId={roomId}
							user={user}
							handleRoomTracks={handleRoomTracks}
							queueTrigger={queueTrigger}
							setQueueTrigger={setQueueTrigger}
						/>
						<button
							className="float-right"
							onClick={() => setLeaveRoomAlert(true)}>
							Leave Room
						</button>
					</Col>
				</Row>
			</Container>
			{/* Leave Room Alert */}
			<Row>
				<Col xs={12}>
					<div className="playlist-alert d-flex align-items-center">
						<Alert
							variant="dark"
							show={leaveRoomAlert}
							onClose={() => setLeaveRoomAlert(false)}
							dismissible>
							<p>Are you sure?</p>
							<p>
								Leaving this Room and joining again will affect your shared
								listening experience.
							</p>
							<button
								onClick={() => {
									window.location = `/home?access_token=${token}`;
								}}>
								Leave Room
							</button>
						</Alert>
					</div>
				</Col>
			</Row>
			<Container>
				<Row>
					{/* Album Image */}
					<Col xs={6} md={6} className="text-center">
						<img
							className="now-playing-img"
							src={
								track && track.albumImages[0]
									? track.albumImages[0]
									: '/images/playlistr-yellow-logo.png'
							}
							alt="Track album artwork"
						/>
					</Col>

					{/* Play Queue */}
					<Col xs={6} md={6}>
						<div className="play-queue">
							<h1>Play Queue</h1>

							<ListGroup className="play-queue-list">
								{queueTracks ? (
									queueTracks.map(obj => (
										<ListGroup.Item
											className="play-queue-item"
											key={obj._id}
											id={obj.spotifyId}
											variant={obj.spotifyId === track.id ? 'warning' : 'dark'}>
											{obj.info}
										</ListGroup.Item>
									))
								) : (
									<p className="queue-help">Add a track to get started...</p>
								)}
							</ListGroup>
						</div>
					</Col>
				</Row>
			</Container>
			<Container>
				<Row>
					{/* Alert */}
					<Col xs={12} sm={6} md={6}>
						{!trackPlaying ? (
							<Alert variant="success">
								<h5>To sync with the Room, open Spotify & play a track</h5>

								<div className="d-flex justify-content-end">
									<button
										className="alert-button"
										onClick={() => handleCurrentlyPlaying(token)}
										variant="outline-success">
										Ready
									</button>
								</div>
							</Alert>
						) : null}

						{/* Music Player */}
						{track.name &&
						track.artists[0] &&
						track.duration &&
						track.progress ? (
							<Player
								token={token}
								track={track}
								trackPlaying={trackPlaying}
								setTrackPlaying={setTrackPlaying}
								handleCurrentlyPlaying={handleCurrentlyPlaying}
								user={user}
								roomId={roomId}
								queueTrigger={queueTrigger}
								setQueueTrigger={setQueueTrigger}
								// emitPlayerAction={this.emitPlayerAction}
								// handlePlayPauseClick={this.handlePlayPauseClick}
								// handleNextClick={this.handleNextClick}
								// getCurrentlyPlaying={this.getCurrentlyPlaying}
								room={roomId}
							/>
						) : null}
					</Col>
					<Col xs={12} sm={6} md={6}>
						{/* User Avatars */}
						<Row>
							<Carousel
								className="room-carousel"
								interval={3500}
								indicators={false}>
								{slides
									? slides.map(slide => (
											<Carousel.Item
												key={`carousel-item-${slides.indexOf(slide)}`}>
												<Container>
													<Row>
														{slide.map(user => (
															<RoomUser
																key={user.id}
																user={user}
																avatar={user.image}
																name={user.name}
															/>
														))}
													</Row>
												</Container>
											</Carousel.Item>
									  ))
									: null}
							</Carousel>
						</Row>
						<Row>
							{/* <p className="status-msg">{this.state.statusMsg}</p> */}
						</Row>
					</Col>
				</Row>
			</Container>
		</div>
	) : null;
};

// class Room extends Component {
// 	constructor() {
// 		super();

// 		let parsedUrl = queryString.parse(window.location.search);
// 		let token = parsedUrl.access_token;
// 		let roomId = parsedUrl.room_id;

// 		this.state = {
// 			user: {},
// 			addedTracks: [],
// 			accessToken: token,
// 			roomId: roomId,
// 			userSong: {},
// 			item: {
// 				album: {
// 					images: [
// 						{
// 							url: './images/playlistr-yellow-logo.png'
// 						}
// 					]
// 				},
// 				name: '',
// 				artists: [{ name: '' }],
// 				duration_ms: 0
// 			},
// 			playbackQueueStatus: 'Paused',
// 			progress: 0,
// 			roomUsers: [],
// 			roomHost: {},
// 			roomSong: {},
// 			alertShow: false,
// 			leaveRoomAlert: false,
// 			statusMsg: '',
// 			slides: []
// 		};
// 	}

// 	// When component mounts, app will connect to socket and user state will be set to response from API call. Then the playlist will be created.

// 	// When the current user joins room, add them to the array of current users on the server (in handler.js)
// 	componentDidMount() {
// 		console.log('mount');
// 		SpotifyAPI.getUserData(this.state.accessToken)
// 			.then(res => {
// 				let currentUser = res.data;

// 				// If user has undefined profile picture, use Playlistr logo instead
// 				if (res.data.images[0] === undefined) {
// 					let newImages = [];
// 					let defaultImage = { url: './images/icons/playlistr-icon.png' };
// 					newImages.push(defaultImage);
// 					currentUser = {
// 						...currentUser,
// 						images: newImages
// 					};
// 				}

// 				this.setState({ user: currentUser });
// 			})
// 			.then(() => this.mountRoomSockets());

// 		this.getCurrentlyPlaying(this.state.accessToken);

// 		// Queries DB for tracks added to current room
// 		this.setRoomTracks(this.state.roomId);
// 	}

// 	componentWillUnmount() {
// 		// Close connection when component unmounts
// 		return () => socket.disconnect();
// 	}

// 	mountRoomSockets = () => {
// 		// Upon connecting to socket, emit that the current user has joined current room
// 		socket.emit('join room', this.state.roomId, this.state.user);

// 		// Listen for status updates for when users join or leave room
// 		socket.on('user status', ({ text }) => this.displayStatusMessage(text));

// 		// Listen for the room's current users in order to set host
// 		socket.on('current users', currentUsers => {
// 			this.setState({ roomUsers: currentUsers }, () => {
// 				this.renderAvatarSlides();

// 				// The first user in the usersArray is the roomHost. If the host leaves, the next person becomes the first in usersArray, becoming the roomHost
// 				this.setState({ roomHost: this.state.roomUsers[0] });
// 			});
// 		});

// 		// Listen if other users click play/pause/next
// 		socket.on('player action', ({ action, message }) => {
// 			if (action === 'play' || action === 'pause') {
// 				this.handlePlayPauseClick(action, this.state.accessToken);
// 				this.displayStatusMessage(message);
// 			} else if (action === 'next') {
// 				this.handleNextClick(this.state.accessToken);
// 				this.displayStatusMessage(message);
// 			}
// 		});

// 		// Listen if a new track gets added to the Play Queue by another user
// 		socket.on('new track', ({ trackId, message }) => {
// 			this.addTrackToPlaybackQueue(this.state.accessToken, trackId);
// 			this.setRoomTracks(this.state.roomId);
// 			this.displayStatusMessage(message);
// 		});

// 		// Listen for the room's current song
// 		socket.on('room song', song => {
// 			this.setState({ roomSong: song });
// 		});
// 	};

// 	// Set statusMsg to display, then remove message after timeout
// 	displayStatusMessage = message => {
// 		this.setState({ statusMsg: message }, () => {
// 			setTimeout(() => {
// 				this.setState({ statusMsg: '' });
// 			}, 2000);
// 		});
// 	};

// 	// GETs track that is currently playing on the users playback queue (Spotify), sets the state with the returned data, and then updates the Play Queue to highlight the track currently playing on the queue
// 	getCurrentlyPlaying = token => {
// 		SpotifyAPI.getUserQueueData(token)
// 			.then(res => {
// 				if (res.status === 204)
// 					throw new Error('Error: User playback queue inactive.');

// 				this.setState(
// 					{
// 						item: res.data.item,
// 						playbackQueueStatus: res.data.is_playing,
// 						progress: res.data.progress_ms,
// 						userSong: res.data
// 					},
// 					() => {
// 						// Set roomSong to the host's song every time getCurrentlyPlaying is called
// 						this.setRoomSong();
// 					}
// 				);
// 			})
// 			.then(() => this.handleQueueRender())
// 			.then(() => this.updatePlayedStatus())
// 			.catch(err => {
// 				// Catching any error that results from trying to get the users current playback info by displaying an Alert and setting item state to an object with no data except our logo to serve as the image URL
// 				if (err) {
// 					this.setState({ alertShow: true });
// 					console.log(err.message);

// 					this.setState({
// 						item: {
// 							album: {
// 								images: [
// 									{
// 										url: './images/playlistr-yellow-logo.png'
// 									}
// 								]
// 							},
// 							name: '',
// 							artists: [{ name: '' }],
// 							duration_ms: 0
// 						}
// 					});
// 				}
// 			});
// 	};

// 	// The host sets the roomSong to what they are currently listening to
// 	setRoomSong = () => {
// 		// Object.keys checks if there are object properties - otherwise, an empty object causes errors if the host is not playing a song
// 		if (
// 			this.state.user.id === this.state.roomHost.id &&
// 			Object.keys(this.state.userSong).length > 0
// 		) {
// 			this.setState({ roomSong: this.state.userSong }, () => {
// 				socket.emit('host song', {
// 					song: this.state.roomSong,
// 					roomId: this.state.roomId
// 				});
// 			});
// 		}
// 	};

// 	addTrackToPlaybackQueue = (token, trackId) => {
// 		SpotifyAPI.addTrackToQueue(token, trackId).catch(err => {
// 			if (err) console.log('Error: Unable to add track to playback queue.');
// 		});
// 	};

// 	setRoomTracks = roomId => {
// 		API.getTracks(roomId)
// 			.then(res => {
// 				this.setState({
// 					addedTracks: res.data.addedTracks
// 				});
// 			})
// 			.catch(err => console.log(err));
// 	};

// 	// Using timeout to determine when the track is done playing
// 	// When time is up, we update track played status in DB and call getCurrently playing to begin the updating process again
// 	updatePlayedStatus = () => {
// 		let timeRemaining = this.state.item.duration_ms - this.state.progress;

// 		setTimeout(() => {
// 			this.handleNextTrack(this.state.roomId, this.state.item.id);
// 			this.getCurrentlyPlaying(this.state.accessToken);
// 		}, timeRemaining);
// 	};

// 	// Using the state of addedTracks to conditionally render the Play Queue.
// 	handleQueueRender = () => {
// 		let addedTracks = this.state.addedTracks;

// 		if (!addedTracks.length) {
// 			return <p className="queue-help">Add a track to get started...</p>;
// 		} else {
// 			return addedTracks.map(track => (
// 				<ListGroup.Item
// 					className="play-queue-item"
// 					key={track._id}
// 					id={track.spotifyId}
// 					variant={this.setVariant(
// 						track.spotifyId,
// 						this.state.item.id,
// 						'warning',
// 						'dark'
// 					)}>
// 					{track.info}
// 				</ListGroup.Item>
// 			));
// 		}
// 	};

// 	// Emit to other users in room if you click play/pause/next
// 	emitPlayerAction = (action, user) => {
// 		socket.emit('user action', {
// 			action,
// 			user,
// 			roomId: this.state.roomId
// 		});
// 	};

// 	handlePlayPauseClick = (action, token) => {
// 		SpotifyAPI.playPausePlayback(action, token)
// 			.then(() => this.getCurrentlyPlaying(token))
// 			.catch(err => console.log(err));
// 	};

// handleNextClick = token => {
// 	// POST that changes to next song in users Spotify playback
// 	SpotifyAPI.nextPlaybackTrack(token).then(() =>
// 		this.handleNextTrack(this.state.roomId, this.state.item.id)
// 	);

// 	// Allowing time for Spotify API to update what's currently playing after making post to play next song
// 	setTimeout(() => this.getCurrentlyPlaying(token), 1000);
// };

// // Verifies track is associated with DB before updating track's instance in DB
// handleNextTrack = (roomId, trackId) => {
// 	API.getTracks(roomId).then(res => {
// 		let trackToUpdate = res.data.addedTracks.filter(
// 			track => !track.played && track.spotifyId === trackId
// 		); // Array of tracks yet to be played that match id of track currently in state

// 		if (trackToUpdate.length > 0) {
// 			// Updating first track in array to allow duplicate tracks to remain unplayed
// 			API.updateTrackPlayedStatus(roomId, trackToUpdate[0].spotifyId);
// 		} else return;
// 	});
// };

// 	// Helper method that compares two id's and sets a variant based on result
// 	setVariant = (id, comparedId, variantA, variantB) => {
// 		if (id === comparedId) return variantA;
// 		return variantB;
// 	};

// 	handleAlertClick = () => {
// 		this.getCurrentlyPlaying(this.state.accessToken);

// 		this.setState({ alertShow: false });
// 	};

// 	renderAvatarSlides = () => {
// 		let currentUsers = [...this.state.roomUsers];

// 		// Create array of slides with 3 user avatars per slide
// 		let allSlides = [];
// 		let numSlides = currentUsers.length / 3;

// 		for (let slideIndex = 0; slideIndex < numSlides; slideIndex++) {
// 			let currentSlide = [];

// 			for (let itemIndex = 0; itemIndex < 3; itemIndex++) {
// 				let user = currentUsers[itemIndex];
// 				if (typeof user != 'undefined') currentSlide.push(user);
// 			}

// 			// Remove first 3 users from array in order to add next 3 user to next slide, etc.
// 			currentUsers.splice(0, 3);

// 			allSlides.push(currentSlide);
// 		}

// 		this.setState({ slides: allSlides });
// 	};

// 	render() {
// 		return (
// 			<div>
// 				<Container className="pt-5 pb-4">
// 					<Row>
// 						{/* Logo */}
// 						<Col xs={12} md={2} className="text-center">
// 							<Image
// 								className="brand-logo"
// 								src="./images/icons/playlistr-yellow-icon.png"
// 							/>
// 						</Col>

// 						{/* Current Room */}
// 						<Col className="room-title" xs={12} md={4}>
// 							<h1>Current Room: {this.state.roomId} </h1>
// 						</Col>

// 						{/* Track Search */}
// 						<Col className="track-search-container" xs={12} md={6}>
// 							<TrackSearch
// 								token={this.state.accessToken}
// 								roomId={this.state.roomId}
// 								user={this.state.user}
// 								setRoomTracks={this.setRoomTracks}
// 								getCurrentlyPlaying={this.getCurrentlyPlaying}
// 								// currentlyPlayingTrack={
// 								// 	this
// 								// 		.state
// 								// 		.item
// 								// }
// 								addTrackToPlaybackQueue={this.addTrackToPlaybackQueue}
// 							/>
// 							<button
// 								className="float-right"
// 								onClick={() => this.setState({ leaveRoomAlert: true })}>
// 								Leave Room
// 							</button>
// 						</Col>
// 					</Row>
// 				</Container>
// 				{/* Leave Room Alert */}
// 				<Row>
// 					<Col xs={12}>
// 						<div className="playlist-alert d-flex align-items-center">
// 							<Alert
// 								variant="dark"
// 								show={this.state.leaveRoomAlert}
// 								onClose={() => this.setState({ leaveRoomAlert: false })}
// 								dismissible>
// 								<p>Are you sure?</p>
// 								<p>
// 									Leaving this Room and joining again will affect your shared
// 									listening experience.
// 								</p>
// 								<button
// 									onClick={() => {
// 										window.location = apiUrl + '/api/spotify/login';
// 									}}>
// 									Leave Room
// 								</button>
// 							</Alert>
// 						</div>
// 					</Col>
// 				</Row>
// 				<Container>
// 					<Row>
// 						{/* Album Image */}
// 						<Col xs={6} md={6} className="text-center">
// 							<img
// 								className="now-playing-img"
// 								src={this.state.item.album.images[0].url}
// 								alt="Track album artwork"
// 							/>
// 						</Col>

// 						{/* Play Queue */}
// 						<Col xs={6} md={6}>
// 							<div className="play-queue">
// 								<h1>Play Queue</h1>

// 								<ListGroup className="play-queue-list">
// 									{this.handleQueueRender()}
// 								</ListGroup>
// 							</div>
// 						</Col>
// 					</Row>
// 				</Container>
// 				<Container>
// 					<Row>
// 						{/* Alert */}
// 						<Col xs={12} sm={6} md={6}>
// 							<Alert show={this.state.alertShow} variant="success">
// 								<h5>To sync with the Room, open Spotify & play a track</h5>

// 								<div className="d-flex justify-content-end">
// 									<button
// 										className="alert-button"
// 										onClick={() => this.handleAlertClick()}
// 										variant="outline-success">
// 										Ready
// 									</button>
// 								</div>
// 							</Alert>

// 							{/* Music Player */}
// 							<Player
// 								token={this.state.accessToken}
// 								item={this.state.item}
// 								isPlaying={this.state.isPlaying}
// 								progress={this.state.progress}
// 								user={this.state.user}
// 								emitPlayerAction={this.emitPlayerAction}
// 								handlePlayPauseClick={this.handlePlayPauseClick}
// 								handleNextClick={this.handleNextClick}
// 								getCurrentlyPlaying={this.getCurrentlyPlaying}
// 								room={this.state.roomId}
// 							/>
// 						</Col>
// 						<Col xs={12} sm={6} md={6}>
// 							{/* User Avatars */}
// 							<Row>
// 								<Carousel
// 									className="room-carousel"
// 									interval={3500}
// 									indicators={false}>
// 									{this.state.slides.map(slide => (
// 										<Carousel.Item key={this.state.slides.indexOf(slide)}>
// 											<Container>
// 												<Row>
// 													{slide.map(user => (
// 														<RoomUser
// 															key={user.id}
// 															user={user}
// 															avatar={user.images[0].url}
// 															name={user.display_name}
// 														/>
// 													))}
// 												</Row>
// 											</Container>
// 										</Carousel.Item>
// 									))}
// 								</Carousel>
// 							</Row>
// 							<Row>
// 								<p className="status-msg">{this.state.statusMsg}</p>
// 							</Row>
// 						</Col>
// 					</Row>
// 				</Container>
// 			</div>
// 		);
// 	}
// }

export default Room;
