import React, { Component } from 'react';
import queryString from 'query-string';
import hexGen from 'hex-generator';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import Carousel from 'react-bootstrap/Carousel';

import Playlist from '../../components/Playlist';
import RoomButtons from '../../components/RoomButtons';

import './style.css';

import SpotifyAPI from '../../utils/SpotifyAPI';
import API from '../../utils/API';

class Home extends Component {
	constructor() {
		super();

		this.state = {
			user: {},
			userImage: '',
			playlists: [],
			accessToken: '',
			selectedPlaylist: '',
			openSpotifyAlert: false,
			playlistAlert: false,
			playlistProgressAlert: false,
			joinRoomAlert: false,
			spinnerClass: 'd-none',
			slides: []
		};
	}

	componentDidMount() {
		let parsed = queryString.parse(window.location.search);
		let token = parsed.access_token;

		this.setState({ accessToken: token });

		this.setState({ spinnerClass: 'd-none' });

		// Fetch user data
		SpotifyAPI.getUserData(token).then(res => {
			console.log(res.data);

			let profilePicture = '';
			if (res.data.images[0].url === undefined) {
				profilePicture = './images/logo.jpg';
			} else {
				profilePicture = res.data.images[0].url;
			}

			console.log('profilePicture: ', profilePicture);

			this.setState({
				user: res.data,
				userImage: profilePicture
			});
		});

		this.verifySpotifyIsActive(token);

		// Fetch playlists & map 8 to each carousel slide - 50 is the max limit to fetch
		SpotifyAPI.getUserPlaylists(token, 50).then(res => {
			let playlists = res.data.items;

			// If playlist image is undefined, use placeholder image
			playlists.map(item => {
				if (item.images[0] === undefined) {
					return item.images.push({
						url: './images/logo.jpg'
					});
				} else {
					return item.images;
				}
			});

			// Create array of slides with 8 playlists per slide
			let allSlides = [];
			let numSlides = playlists.length / 8;

			for (let slideIndex = 0; slideIndex < numSlides; slideIndex++) {
				let currentSlide = [];

				for (let itemIndex = 0; itemIndex < 8; itemIndex++) {
					let playlist = playlists[itemIndex];
					if (playlist !== undefined) currentSlide.push(playlist);
				}

				// Remove first 8 playlists from array in order to add next 8 playlists to next slide, etc.
				playlists.splice(0, 8);

				allSlides.push(currentSlide);
			}

			this.setState({ slides: allSlides });
		});
	}

	// Verifies Spotify app is open and playing a track
	verifySpotifyIsActive = token => {
		SpotifyAPI.getUserQueueData(token)
			.then(res => {
				if (!res.data.is_playing)
					throw new Error('Error: Please open Spotify and play a track.');
				else if (res.data.is_playing)
					this.setState({
						openSpotifyAlert: false
					});
			})
			.catch(err => {
				if (err)
					this.setState({
						openSpotifyAlert: true
					});
			});
	};

	// Redirects user to a Room passing along the token and room id in the url
	setUrl = (accessToken, hex) => {
		let homeUrl = window.location.href;
		console.log('homeUrl:', homeUrl);
		console.log('accessToken:', accessToken);

		if (homeUrl === `http://localhost:3000/home?access_token=${accessToken}`) {
			console.log('Redirecting to development music room...');
			window.location.replace(
				`http://localhost:3000/room?access_token=${accessToken}&room_id=${hex}`
			);
		} else if (homeUrl === `https://playlistr-io.herokuapp.com/home?access_token=${accessToken}`) {
			console.log('Redirecting to production music room...');
			window.location.replace(
				`http://playlistr-io.herokuapp.com/room?access_token=${accessToken}&room_id=${hex}`
			);
		}
	};

	handlePlaylistClick = e => {
		if (!this.state.playlistAlert) {
			this.setState({ playlistAlert: true });
			this.setState({ selectedPlaylist: e.target.id });
		} else {
			this.setState({ playlistAlert: false });
		}
	};

	// Creates room containing user's playlist
	createPlaylistRoom = e => {
		e.preventDefault();

		let roomHex = hexGen(24);
		let timeoutLength = 0;

		// Create room with generated hex -- 422 response sent to catch
		API.createRoom(roomHex)
			.then(res => {
				if (res.status === 422) throw new Error('Error');
			})
			.then(() => {
				// GET all tracks on the playlist
				SpotifyAPI.getPlaylistTracks(this.state.accessToken, this.state.selectedPlaylist)
					.then(res => {
						return res.data.items;
					})
					.then(data => {
						// Sets the time needed to POST playlist data properly before redirecting
						timeoutLength = data.length * 300 + 300;

						// Add tracks to user's playback queue and Room in DB -- allowing enough time for tracks to be added to both in the correct order
						data.forEach((item, index) => {
							let trackInfo = `${item.track.name} - ${item.track.artists[0].name}`;

							setTimeout(() => {
								API.addTrack(roomHex, item.track.id, trackInfo)
									.then(() => console.log('Added to Room in DB'))
									.catch(err => console.log(err));

								SpotifyAPI.addTrackToQueue(
									this.state.accessToken,
									item.track.id
								)
									.then(() => console.log('Added to Queue'))
									.catch(err => console.log(err));
							}, index * 300);
						});
					})
					.then(() => {
						this.setState({
							spinnerClass: ''
						});

						console.log('Setting timeout for room:', roomHex);

						//	Set URL after all POSTs have completed
						setTimeout(
							() => {
								console.log('CREATING ROOM AFTER TIMEOUT:', roomHex);
								this.setUrl(this.state.accessToken, roomHex);
							},
							timeoutLength
						);
					});
			})
			.catch(err => {
				if (err) console.log(err.message);
			});
	};

	// Sets boolean value of playlistProgressAlert state based on current state
	setPlaylistProgress = () => {
		this.state.playlistProgressAlert
			? this.setState({ playlistProgressAlert: false })
			: this.setState({ playlistProgressAlert: true });
	};

	// Sets boolean value of joinRoomAlert state based on current state
	setJoinRoomAlert = () => {
		this.state.joinRoomAlert
			? this.setState({ joinRoomAlert: false })
			: this.setState({ joinRoomAlert: true });
	};

	render() {
		return (
			<div>
				<Container>
					<Row className="top-banner">

						{/* Profile Image */}
						<Col xs={12} sm={12} md={3} lg={2} className="text-center">
							<Image
								roundedCircle
								src={this.state.userImage}
								className="home profile-pic"
							/>
							<p className="user-name">{this.state.user.display_name}</p>
						</Col>

						{/* Welcome to Playlistr Banner */}
						<Col
							xs={12}
							sm={12}
							md={6}
							lg={7}
							className="d-flex justify-content-center align-items-center">
							<h1 className="home-banner">
								Welcome to{' '}
								<span className="welcome-brand">Playlistr</span>
							</h1>
						</Col>
						<Col xs={12} md={3} lg={3}>
							<div className="d-flex align-items-center">
								{/* Inactive Spotify Alert */}
								<Alert
									variant="dark"
									show={this.state.openSpotifyAlert}>
									<p>
										Please open Spotify and play a track to
										get started.
									</p>
									<button
										onClick={() =>
											this.verifySpotifyIsActive(
												this.state.accessToken
											)
										}>
										Ready
									</button>
								</Alert>
							</div>
						</Col>
					</Row>
					<Row>
						<Col>
							<div className="playlist-alert d-flex align-items-center">
								{/* Create Room with Playlist Alert */}
								<Alert
									variant="dark"
									show={this.state.playlistAlert}
									onClose={this.handlePlaylistClick}
									dismissible>
									<p>
										Are you sure you want to start a room
										with this playlist?
									</p>
									<button onClick={event => {
										this.createPlaylistRoom(event);
										this.setPlaylistProgress();	// Displays playlist progress spinner
										this.setState({ playlistAlert: false }); // Closes "Are you sure?" modal
									}}>
										<Spinner
											as="span"
											animation="border"
											size="sm"
											role="status"
											aria-hidden="true"
											className={
												this.state.spinnerClass
											}
										/>{' '}
										<span> Create Room</span>
									</button>
								</Alert>
							</div>
							<div className="playlist-alert d-flex align-items-center text-center">
								{/* Creating Room from Playlist Alert */}
								<Alert
									variant="dark"
									show={this.state.playlistProgressAlert}
									className="shadow-lg">
									<h5>Creating room from playlist...</h5>
									<Spinner
										className="text-center"
										as="span"
										animation="border"
										size="lg"
										role="status"
										aria-hidden="true"
									/>{' '}
								</Alert>
							</div>
							<div className="playlist-alert d-flex align-items-center text-center">
								{/* Join Room Sync Alert */}
								<Alert
									variant="dark"
									show={this.state.joinRoomAlert}
									className="shadow-lg">
									<h5>Syncing your Spotify queue with Room...</h5>
									<Spinner
										className="text-center"
										as="span"
										animation="border"
										size="lg"
										role="status"
										aria-hidden="true"
									/>{' '}
								</Alert>
							</div>
						</Col>
					</Row>
				</Container>

				{/* Playlist Carousel */}
				<Container>
					<Row>
						<Carousel
							className="mb-2 home-carousel"
							interval={5000}
							indicators={false}>
							{this.state.slides.map(slide => (
								<Carousel.Item key={this.state.slides.indexOf(slide)}>
									<Container>
										<Row>
											{slide.map(playlist => (
												<Playlist
													key={
														playlist.id
													}
													playlistId={
														playlist.id
													}
													image={
														playlist
															.images[0]
															.url
													}
													link={
														playlist
															.owner
															.external_urls
															.spotify
													}
													name={
														playlist.name
													}
													handlePlaylistClick={
														this
															.handlePlaylistClick
													}
												/>
											))}
										</Row>
									</Container>
								</Carousel.Item>
							))}
						</Carousel>
					</Row>
				</Container>

				{/* Room Buttons */}
				<Container>
					<RoomButtons
						token={this.state.accessToken}
						setUrl={this.setUrl}
						setJoinRoomAlert={this.setJoinRoomAlert}
					/>
				</Container>
			</div>
		);
	}
}

export default Home;
