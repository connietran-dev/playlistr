import React, { Component } from 'react';
import hexGen from 'hex-generator';
import { Link } from 'react-router-dom';

import API from '../../utils/API';
import SpotifyAPI from '../../utils/SpotifyAPI';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';

import './style.css';

class RoomButtons extends Component {
	constructor(props) {
		super(props);

		let roomHex = hexGen(24); // Output: 6 character hex

		this.state = {
			joinRoomInput: '',
			inputAlertDisplay: false,
			spinnerDisplay: 'd-none',
			roomHex: roomHex
		};
	}

	// Helper function that set's the URL of the Room page when create room is interacted with
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

	syncQueueWithRoomAndJoin = roomId => {
		API.getTracks(roomId)
			.then(res => {
				// Creating an array of tracks that have yet to be played
				let notPlayedTracks = res.data.addedTracks.filter(track => !track.played);

				// Conditionally adding tracks to users playback queue -- setTimeout time is being multiplied by the index of the track in the array to ensure each API call waits for the previous call to finish.
				if (notPlayedTracks.length) {
					notPlayedTracks.forEach((track, index) => {
						setTimeout(() => {
							SpotifyAPI.addTrackToQueue(this.props.token, track.spotifyId)
								.then(response => console.log(response))
								.catch(err => console.log(err));
						}, index * 50);
					});
				}
			})
			.catch(err => console.log(err));

		// Display spinner while API calls are being made leading up to the url being set to join room
		this.setState({ spinnerDisplay: '' });

		// Giving the Spotify API time to queue up all tracks before setting url to join the room
		setTimeout(() => this.setUrl(this.props.token, roomId), 3000);
	};

	// Create Room button handler. Creates new Room in DB, then sets url.
	handleCreateRoom = e => {
		e.preventDefault();

		API.createRoom(this.state.roomHex)
			.then(() => this.setUrl(this.props.token, this.state.roomHex))
			.catch(err => console.log(err));
	};

	// Verifies input is 6 digits and uses setUrl
	handleJoinRoom = e => {
		e.preventDefault();

		// Verifies a user has put in a 6 digit room id
		if (this.state.joinRoomInput && this.state.joinRoomInput.length === 6) {
			this.syncQueueWithRoomAndJoin(this.state.joinRoomInput);
		} else {
			this.setState({ inputAlertDisplay: true });

			setTimeout(() => this.setState({ inputAlertDisplay: false }), 3000);
		}
	};

	handleInputChange = e => {
		this.setState({ joinRoomInput: e.target.value });
	};

	render() {
		return (
			<Row>
				<Col md={6} xs={8}>
					<Form className="join-room-form">
						<InputGroup>
							<Link to="/room">
								<button
									className="join-room-btn"
									onClick={this.handleJoinRoom}>
									<Spinner
										as="span"
										animation="border"
										size="sm"
										role="status"
										aria-hidden="true"
										className={this.state.spinnerDisplay}
									/>{' '}
									<span> Join a Room</span>
								</button>
							</Link>

							<input
								className="room-input ml-2"
								onChange={this.handleInputChange}
								value={this.state.joinRoomInput}
								placeholder="Room code"
							/>
						</InputGroup>
					</Form>
					<Alert
						show={this.state.inputAlertDisplay}
						variant="warning"
						className={this.state.inputAlertDisplay}>
						Please enter a valid Room ID
					</Alert>
				</Col>
				<Col md={6} xs={4}>
					<Link to="/room">
						<button
							onClick={this.handleCreateRoom}
							className="float-right join-room-btn">
							Create a Room
						</button>{' '}
					</Link>
				</Col>
			</Row>
		);
	}
}

export default RoomButtons;
