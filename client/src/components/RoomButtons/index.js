import React, { useState } from 'react';
import hexGen from 'hex-generator';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Alert from 'react-bootstrap/Alert';

import './style.css';

const RoomButtons = ({ token }) => {
	// useState to set and store what the user room input
	const [roomInput, setRoomInput] = useState('');

	// useState for error handler
	const [show, setShow] = useState('d-none');

	// Outputs 6 character hex code that will serve as the Room Id
	let roomHex = hexGen(24);

	// Helper function that set's the URL of the Room page when create room is interacted with
	const setUrl = (accessToken, hex) => {
		let homeUrl = window.location.href;

		if (homeUrl === `http://localhost:3000/home?access_token=${accessToken}`) {
			window.location.href = `http://localhost:3000/room?access_token=${accessToken}&room_id=${hex}`;
		}

		if (homeUrl === `https://playlistr-io.herokuapp.com/home?access_token=${accessToken}`) {
			window.location.href = `http://playlistr-io.herokuapp.com/room?access_token=${accessToken}&room_id=${hex}`;
		}
	};

	// Verifies input is 6 digits and uses setUrl
	const handleJoinRoom = e => {
		e.preventDefault();

		// Verifies a user has put in a 6 digit room id
		if (roomInput && roomInput.length === 6) setUrl(token, roomInput);
		else {
			setShow('');
			setTimeout(() => setShow('d-none'), 3000);
		}
	};

	return (
		<Row>
			<Col md={6} xs={8}>
				<Form className="join-room-form">
					<InputGroup>
						<button className="join-room-btn" onClick={handleJoinRoom}>
							Join a Room
						</button>

						<FormControl
							className="room-input"
							onChange={e => setRoomInput(e.target.value)}
							value={roomInput}
						/>
					</InputGroup>
				</Form>
				<Alert variant="warning" className={show}>
					Please enter a valid Room ID
				</Alert>
			</Col>
			<Col md={6} xs={4}>
				<button onClick={() => setUrl(token, roomHex)} className="float-right join-room-btn">
					Create a Room
				</button>
			</Col>
		</Row>
	);
};

export default RoomButtons;
