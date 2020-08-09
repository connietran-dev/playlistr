import React from 'react';

import Image from 'react-bootstrap/Image';
import Col from 'react-bootstrap/Col';

import './style.css';

const Playlist = props => {
	return (
		<Col xs={6} md={3} className="d-flex justify-content-end">
			<div className="user-playlist" onClick={props.handlePlaylistClick}>
				<Image
					rounded
					id={props.playlistId}
					src={props.image}
					width={150}
					height={150}
					alt={props.name}
				/>
				<p className="playlist-name text-white mt-2">{props.name}</p>
			</div>
		</Col>
	);
};

export default Playlist;
