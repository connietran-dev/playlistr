import React from 'react';

import ProgressBar from 'react-bootstrap/ProgressBar';

import './style.css';

const Player = props => {
	const handlePlayPauseClick = (action, token) => {
		fetch(`https://api.spotify.com/v1/me/player/${action}`, {
			method: 'PUT',
			headers: {
				Authorization: 'Bearer ' + token,
				'Content-Type': 'application/json'
			}
		})
			.then(() => props.getCurrentlyPlaying(props.token))
			.catch(err => console.log(err));
	};

	// POST that changes to next song in users playback. After track is changed, we GET current playback data to update displaying track data
	const handleNextClick = token => {
		fetch('https://api.spotify.com/v1/me/player/next', {
			method: 'POST',
			headers: {
				Authorization: 'Bearer ' + token,
				'Content-Type': 'application/json'
			}
		})
			.then(() => props.getCurrentlyPlaying(props.token))
			.catch(err => console.log(err));
	};

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
					onClick={() => handlePlayPauseClick('play', props.token)}>
					<i className="fa fa-play fa-lg"></i>
				</button>
				<button
					type="button"
					className="btn"
					onClick={() => handlePlayPauseClick('pause', props.token)}>
					<i className="fa fa-pause fa-lg"></i>
				</button>
				<button type="button" className="btn" onClick={() => handleNextClick(props.token)}>
					<i className="fa fa-forward fa-lg"></i>
				</button>
			</div>
		</div>
	);
};

export default Player;
