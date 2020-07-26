import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';

const Queue = props => {
	// Conditionally render queue list based on tracks on playlist. When the playlist is created, tracks are undefined.
	const handleQueueRender = () => {
		if (!props.playlistTracks.items || !props.playlistTracks.items.length) {
			return;
		} else {
			console.log('Playlist Tracks:');
			console.log(props.playlistTracks.items);

			return props.playlistTracks.items.map(trackData => (
				<ListGroup.Item action variant="dark" id={trackData.track.id}>
					{`${trackData.track.name} - ${trackData.track.artists[0].name}`}
				</ListGroup.Item>
			));
		}
	};

	return (
		<div
			style={{
				height: '300px',
				border: '1px solid black'
			}}>
			<h1>Play Queue</h1>
			<ListGroup variant="dark">{handleQueueRender()}</ListGroup>
		</div>
	);
};

export default Queue;
