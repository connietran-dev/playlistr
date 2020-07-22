import React from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

const RoomButtons = () => {
	return (
		<div>
			<Button className="float-left">Join a Room</Button>

			<Link to="/room">
				<Button className="float-right">Create a Room</Button>
			</Link>
		</div>
	);
};

export default RoomButtons;
