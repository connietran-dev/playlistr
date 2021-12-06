import React, { useState } from 'react';
import hexGen from 'hex-generator';
import { Link } from 'react-router-dom';

import API from '../../utils/API';
import SpotifyAPI from '../../utils/SpotifyAPI';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Alert from 'react-bootstrap/Alert';

import globalUtils from '../../utils/globalUtils';
import utils from './utils';
import './style.css';

const RoomButtons = props => {
	const [input, setInput] = useState('');
	const [showAlert, setShowAlert] = useState(false);

	const syncQueueWithRoomAndJoin = async tracks => {
		try {
			props.renderCenterAlert(props.centerAlertConfig.joinRoom);

			if (tracks && tracks[0]) {
				for await (const track of tracks) {
					await SpotifyAPI.addTrackToQueue(props.token, track.spotifyId);
				}
			}
			props.renderCenterAlert(props.centerAlertConfig.clear);
			globalUtils.addRoomToURL(window.location.href, props.token, input);
		} catch (err) {
			console.log(err);
			props.renderCenterAlert(props.centerAlertConfig.somethingWentWrong);
		}
	};

	const handleJoinRoom = async e => {
		e.preventDefault();

		if (input) {
			const unplayedTracks = await utils.getUnplayedTracks(input);
			unplayedTracks
				? await syncQueueWithRoomAndJoin(unplayedTracks)
				: props.renderCenterAlert(props.centerAlertConfig.noRoomData);
		} else {
			setShowAlert(true);
			setTimeout(() => setShowAlert(false), 3000);
		}
	};

	const handleCreateRoom = async () => {
		try {
			props.renderCenterAlert(props.centerAlertConfig.createRoom);

			const { data } = await API.createRoom(hexGen(16));

			props.renderCenterAlert(props.centerAlertConfig.clear);
			globalUtils.addRoomToURL(window.location.href, props.token, data.room_id);
		} catch (err) {
			console.log(err);
			props.renderCenterAlert(props.centerAlertConfig.somethingWentWrong);
		}
	};

	return (
		<div>
			<Row className="fixed-bottom room-buttons-container">
				<Col md={8} xs={12}>
					<Form>
						{props.token ? (
							<InputGroup>
								<button
									className="join-room-btn"
									onClick={e => handleJoinRoom(e)}>
									Join a Room
								</button>

								<input
									className="room-input ml-2"
									onChange={e => setInput(e.target.value)}
									value={input}
									placeholder="Room code"
								/>
							</InputGroup>
						) : null}
					</Form>
					<Alert show={showAlert} variant="warning">
						Please enter a valid Room Code
					</Alert>
				</Col>
				<Col md={4} xs={12}>
					<button
						className="float-right create-room-btn"
						onClick={() => handleCreateRoom()}>
						Create a Room
					</button>
				</Col>
			</Row>
		</div>
	);
};
// class RoomButtons extends Component {
// 	constructor(props) {
// 		super(props);

// 		this.state = {
// 			joinRoomInput: '',
// 			inputAlertDisplay: false,
// 			roomHex: ''
// 		};
// 	}

// 	componentDidMount() {
// 		this.setState({ roomHex: hexGen(16) });
// 	}

// 	syncQueueWithRoomAndJoin = async addedTracks => {
// 		try {
// 			const notPlayedTracks = addedTracks.filter(track => !track.played);

// 			if (notPlayedTracks[0]) {
// 				for await (const track of notPlayedTracks) {
// 					await SpotifyAPI.addTrackToQueue(this.props.token, track.spotifyId);
// 				}
// 			}
// 		} catch (err) {
// 			this.setState({ inputAlertDisplay: true });
// 			setTimeout(() => this.setState({ inputAlertDisplay: false }), 3000);
// 		}
// 	};

// 	handleJoinRoom = async () => {
// 		try {
// 			if (this.state.joinRoomInput) {
// 				const playlist = await API.getTracks(this.state.joinRoomInput);

// 				if (playlist.data) {
// 					await this.syncQueueWithRoomAndJoin(playlist.data.addedTracks);
// 				} else throw new Error('No Room Data');
// 			} else {
// 				this.setState({ inputAlertDisplay: true });
// 				setTimeout(() => this.setState({ inputAlertDisplay: false }), 3000);
// 			}
// 		} catch (err) {
// 			if (err)
// 				window.location.replace(
// 					`/home?access_token=${this.props.token}&error=join_room`
// 				);
// 		}
// 	};

// 	render() {
// 		return (
// <div>
// 	<Row className="fixed-bottom room-buttons-container">
// 		<Col md={8} xs={12}>
// 			<Form>
// 				{this.props.token ? (
// 					<InputGroup>
// 						<Link
// 							to={
// 								this.state.joinRoomInput
// 									? `/room?access_token=${this.props.token}&room_id=${this.state.joinRoomInput}`
// 									: `/home?access_token=${this.props.token}`
// 							}
// 							onClick={() => this.handleJoinRoom()}>
// 							<button className="join-room-btn">Join a Room</button>
// 						</Link>

// 						<input
// 							className="room-input ml-2"
// 							onChange={e =>
// 								this.setState({ joinRoomInput: e.target.value })
// 							}
// 							value={this.state.joinRoomInput}
// 							placeholder="Room code"
// 						/>
// 					</InputGroup>
// 				) : null}
// 			</Form>
// 			<Alert show={this.state.inputAlertDisplay} variant="warning">
// 				Please enter a valid Room Code
// 			</Alert>
// 		</Col>
// 		<Col md={4} xs={12}>
// 			{this.props.token && this.state.roomHex ? (
// 				<Link
// 					to={`/room?access_token=${this.props.token}&room_id=${this.state.roomHex}`}
// 					onClick={() => API.createRoom(this.state.roomHex)}>
// 					<button className="float-right create-room-btn">
// 						Create a Room
// 					</button>
// 				</Link>
// 			) : null}
// 		</Col>
// 	</Row>
// </div>
// 		);
// 	}
// }

export default RoomButtons;
