import React from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import hexGen from 'hex-generator';

const RoomButtons = ({ token }) => {
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

	return (
		<div>
			<Button className="float-left">Join a Room</Button>

			<Link to="/room">
				<Button onClick={() => setUrl(token, roomHex)} className="float-right">
					Create a Room
				</Button>
			</Link>
		</div>
	);
};

export default RoomButtons;
