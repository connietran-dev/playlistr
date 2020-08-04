import React, { Component } from 'react';
import hexGen from 'hex-generator';
import { Link } from 'react-router-dom';
import axios from 'axios';

import API from '../../utils/API';
import SpotifyAPI from '../../utils/SpotifyAPI';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Alert from 'react-bootstrap/Alert';

import './style.css';

class RoomButtons extends Component {
	constructor(props) {
		super(props);

		let roomHex = hexGen(24); // Output: 6 character hex

		this.state = {
			joinRoomInput: '',
			inputAlertDisplay: false,
			roomHex: roomHex
		};
	}

	// // Helper function that set's the URL of the Room page when create room is interacted with
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

				// Conditionally adding tracks to users playback queue -- setTimeout to ensure tracks are set in correct order
				if (notPlayedTracks.length) {
					notPlayedTracks.map(track => {
						return setTimeout(() => {
							SpotifyAPI.addTrackToQueue(
								this.props.token,
								track.spotifyId
							).catch(err => console.log(err));
						}, 50);
					});
				} else return;
			})
			// After determining what to add to the users playback queue, set url and join the room
			.then(() => this.setUrl(this.props.token, roomId))
			.catch(err => console.log(err));
	};

	// Create Room button handler. Creates new Room in DB, then sets url.
	handleCreateRoom = e => {
		e.preventDefault();

		axios.post('/api/rooms', {
			room_id: this.state.roomHex
		})
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
									Join a Room
								</button>
							</Link>

							<FormControl
								className="room-input"
								onChange={this.handleInputChange}
								value={this.state.joinRoomInput}
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
