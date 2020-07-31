import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';

const Queue = props => {
	return (
		<div>
			<h1>Play Queue</h1>
			<div
				style={{
					height: '200px',
					overflowY: 'auto'
				}}>
				<ListGroup>{props.handleQueueRender()}</ListGroup>
			</div>
		</div>
	);
};

export default Queue;
