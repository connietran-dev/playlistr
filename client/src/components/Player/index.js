import React from 'react';
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
			.then(res => res.json())
			.catch(err => console.log(err));
	};

	const handleNextClick = token => {
		fetch('https://api.spotify.com/v1/me/player/next', {
			method: 'POST',
			headers: {
				Authorization: 'Bearer ' + token,
				'Content-Type': 'application/json'
			}
		})
			.then(res => res.json())
			.catch(err => console.log(err));
	};

	return (
		<div className="now-playing-container">
			<div className="pt-5">
				<div className="now-playing-name">{props.item.name}</div>
				<div className="now-playing-artist">{props.item.artists[0].name}</div>
			</div>
			<div className="text-center player-buttons">
				<button
					type="button"
					id="button_play"
					className="btn"
					onClick={() => handlePlayPauseClick('play', props.token)}>
					<i class="fa fa-play"></i>
				</button>
				<button
					type="button"
					className="btn"
					onClick={() => handlePlayPauseClick('pause', props.token)}>
					<i class="fa fa-pause"></i>
				</button>
				<button type="button" className="btn" onClick={() => handleNextClick(props.token)}>
					<i class="fa fa-forward"></i>
				</button>
			</div>
		</div>
	);
};

export default Player;
