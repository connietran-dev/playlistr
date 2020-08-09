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
import CarouselSlide from '../../components/CarouselSlide';

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
			showAlert: false,
			spinnerClass: 'd-none',
			slides: []
		};
	}

	componentDidMount() {
		let parsed = queryString.parse(window.location.search);
		let token = parsed.access_token;

		this.setState({ accessToken: token });

		// Fetch user data
		SpotifyAPI.getUserData(token)
			.then(res => {
				console.log(res.data);
				this.setState({
					user: res.data,
					userImage: res.data.images[0].url
				});
			});

		// Fetch playlists
		SpotifyAPI.getUserPlaylists(token, 50)
			.then(res => {
				let playlists = res.data.items;
				// If playlist image is undefined, create placeholder image
				playlists.map(item => {
					if (item.images[0] === undefined) {
						return item.images.push({
							url: './images/logo.jpg'
						});
					} else {
						return item.images;
					}
				});
				this.setState({ playlists: playlists });
			});

		SpotifyAPI.getUserPlaylists(token, 50)
			.then(res => {
				let playlists = res.data.items;
				let allSlides = [];
				let numSlides = (playlists.length / 8);

				for (let slideIndex = 0; slideIndex < numSlides; slideIndex++) {
					let currentSlide = [];

					for (let itemIndex = 0; itemIndex < 8; itemIndex++) {
						let playlist = playlists[itemIndex];
						currentSlide.push(playlist);
					};

					playlists.splice(0, 8);

					allSlides.push(currentSlide);
				};

				console.log(allSlides);

				this.setState({ slides: allSlides }, () => {
					this.state.slides.map(slide => {
						console.log(slide);
					})
				});
			});
	};

	setUrl = (accessToken, hex) => {
		let homeUrl = window.location.href;

		console.log(accessToken);
		console.log(hex);

		if (homeUrl === `http://localhost:3000/home?access_token=${accessToken}`) {
			window.location.href = `http://localhost:3000/room?access_token=${accessToken}&room_id=${hex}`;
		}

		if (homeUrl === `https://playlistr-io.herokuapp.com/home?access_token=${accessToken}`) {
			window.location.href = `http://playlistr-io.herokuapp.com/room?access_token=${accessToken}&room_id=${hex}`;
		}
	};

	handlePlaylistClick = e => {
		if (!this.state.showAlert) {
			this.setState({ showAlert: true });
			this.setState({ selectedPlaylist: e.target.id });
		} else {
			this.setState({ showAlert: false });
		}
	};

	// Creates room containing user's playlist
	createPlaylistRoom = e => {
		e.preventDefault();

		let roomHex = hexGen(24);

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
					});
			})
			.catch(err => {
				if (err) console.log(err.message);
			});

		this.setState({ spinnerClass: '' });

		// Giving time for tracks to be added to users playback queue and Room in RB
		setTimeout(() => this.setUrl(this.state.accessToken, roomHex), 4000);
	};

	render() {
		return (
			<div>
				<Container>
					<Row className="top-banner">
						<Col xs={12} md={2} className="text-center">
							<Image
								roundedCircle
								src={this.state.userImage}
								className="profile-pic"
							/>
							<p className="user-name">{this.state.user.display_name}</p>
						</Col>
						<Col xs={12} md={7}>
							<h1 className="top-banner">
								Welcome to{' '}
								<span className="welcome-brand">Playlistr</span>
							</h1>
						</Col>
						<Col xs={12} md={2} className="float-right">
							<input placeholder="Search" />
							<i className="fa fa-search" aria-hidden="true"></i>
						</Col>
					</Row>
					<Row>
						<Col>
							<div className="playlist-alert">
								<Alert
									variant="dark"
									show={this.state.showAlert}
									onClose={this.handlePlaylistClick}
									dismissible>
									<p>
										Are you sure you want to start a room
										with this playlist?
									</p>
									<button onClick={this.createPlaylistRoom}>
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
						</Col>
					</Row>
				</Container>
				<Container>
					<Row>
						<Carousel>
							{this.state.slides.map(slide => (
								<CarouselSlide 
									playlists={this.state.slides}
								/>
							))}
						</Carousel>
					</Row>
					{/* <Row className="mb-4 d-flex align-self-center">
						{this.state.playlists.map(playlist => (
							<Playlist
								key={playlist.id}
								playlistId={playlist.id}
								image={playlist.images[0].url}
								link={playlist.owner.external_urls.spotify}
								name={playlist.name}
								handlePlaylistClick={this.handlePlaylistClick}
							/>
						))}
					</Row> */}
				</Container>
				<Container>
					<RoomButtons token={this.state.accessToken} setUrl={this.setUrl} />
				</Container>
			</div>
		);
	}
}

export default Home;
