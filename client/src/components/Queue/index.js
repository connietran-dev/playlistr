import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';

const Queue = props => {
	// Conditionally render queue list based on tracks on playlist. When the playlist is created, tracks are undefined. This helps prevent an error that would thrown if map() is called on an undefined property or empty array. Playlist Tracks are initially undefined and empty until the playlist actually has tracks.
	const handleQueueRender = () => {
		if (!props.playlistTracks.items || !props.playlistTracks.items.length) {
			return;
		} else {
			return props.playlistTracks.items.map(trackData => (
				<ListGroup.Item key={trackData.track.uri} action variant="dark" id={trackData.track.id}>
					{`${trackData.track.name} - ${trackData.track.artists[0].name}`}
				</ListGroup.Item>
			));
		}
	};

	return (
		<div
			style={{
				height: '300px',
				border: '1px solid black',
				overflowY: 'auto'
			}}>
			<h1>Play Queue</h1>
			<ListGroup variant="dark">{handleQueueRender()}</ListGroup>
		</div>
	);
};

export default Queue;
