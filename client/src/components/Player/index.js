import React from 'react';

import ProgressBar from 'react-bootstrap/ProgressBar';

import './style.css';

const Player = props => {
	const calcSongProgress = () => (props.progress / props.item.duration_ms) * 100;

	return (
		<div className="now-playing-container">
			<div className="pt-2 mb-4 text-center">
				<div className="now-playing-name">{props.item.name}</div>
				<div className="now-playing-artist">{props.item.artists[0].name}</div>
			</div>
			<ProgressBar
				animated
				now={calcSongProgress()}
				variant="success"
				className="mx-auto mb-2"
				style={{ height: "10px", width: "70%" }}
			/>
			<div className="text-center player-buttons">
				<button
					type="button"
					id="button_play"
					className="btn"
					onClick={() => {
						props.handlePlayPauseClick('play', props.token);
						props.emitPlayerAction('play', props.user);
					}}>
					<i className="fa fa-play fa-lg"></i>
				</button>
				<button
					type="button"
					className="btn"
					onClick={() => {
						props.handlePlayPauseClick('pause', props.token);
						props.emitPlayerAction('pause', props.user);
					}}>
					<i className="fa fa-pause fa-lg"></i>
				</button>
				<button type="button" className="btn" onClick={() => {
					props.handleNextClick(props.token);
					props.emitPlayerAction('next', props.user);
				}}>
					<i className="fa fa-forward fa-lg"></i>
				</button>
			</div>
		</div>
	);
};

export default Player;
