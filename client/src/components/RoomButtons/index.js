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

		this.state = {
			joinRoomInput: '',
			inputAlertDisplay: false,
			spinnerDisplay: 'd-none',
			roomHex: hexGen(24) // Output: 6 character hex
		};
	}

	syncQueueWithRoomAndJoin = roomId => {
		let timeoutLength = 0;

		API.getTracks(roomId)
			.then(res => {
				// Creating an array of tracks that have yet to be played
				let notPlayedTracks = res.data.addedTracks.filter(track => !track.played);

				return notPlayedTracks;
			})
			.then(data => {
				timeoutLength = data.length * 300 + 300; // Adding an additional 300 ms to allow final POST to complete

				// Conditionally adding tracks to users playback queue -- setTimeout time is being multiplied by the index of the track in the array to ensure each API call allows enough time for the previous call to finish.
				if (data.length) {
					data.forEach((track, index) => {
						setTimeout(() => {
							SpotifyAPI.addTrackToQueue(this.props.token, track.spotifyId)
								.then(response => console.log(response))
								.catch(err => console.log(err));
						}, index * 300);
					});
				} else return;
			})
			.then(() => {
				// Display spinner while API calls are being made leading up to the url being set to join room
				this.setState({ spinnerDisplay: '' });

				// Giving the Spotify API time to queue up all tracks before setting url to join the room
				setTimeout(() => this.props.setUrl(this.props.token, roomId), timeoutLength);
			})
			.catch(err => console.log(err));
	};

	// Create Room button handler. Creates new Room in DB, then sets url.
	handleCreateRoom = e => {
		e.preventDefault();

		API.createRoom(this.state.roomHex)
			.then(() => this.props.setUrl(this.props.token, this.state.roomHex))
			.catch(err => console.log(err));
	};

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
			<div>
				<Row>
					<Col md={8} xs={12}>
						<Form>
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
					<Col md={4} xs={12}>
						<Link to="/room">
							<button
								onClick={this.handleCreateRoom}
								className="float-right join-room-btn">
								Create a Room
						</button>{' '}
						</Link>
					</Col>

				</Row>

			</div>

		);
	}
}

export default RoomButtons;
