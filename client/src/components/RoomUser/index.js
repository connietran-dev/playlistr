import React from 'react';

import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';

const RoomUser = props => {
	return (
		<Col xs={4} className="text-center">
			<div className="room-avatar">
				<a href={props.user.url} target="_blank" rel="noopener noreferrer">
					<Image roundedCircle src={props.user.image} className="profile-pic" />
				</a>
				<p>{props.user.name}</p>
			</div>
		</Col>
	);
};

export default RoomUser;
