import React from 'react';

import Image from 'react-bootstrap/Image';
import Col from 'react-bootstrap/Col';

import './style.css';

const Playlist = props => {
	return (
		<Col xs={6} md={3}>
			<div className="user-playlist" onClick={props.handlePlaylistClick}>
				<Image
					rounded
					id={props.playlistId}
					src={props.image}
					width={171}
					height={180}
					alt={props.name}
				/>
				<p className="text-white mt-2">{props.name}</p>
			</div>
		</Col>
	);
};

export default Playlist;
