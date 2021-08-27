import React, { useState, useEffect } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';

import SpotifyAPI from '../../utils/SpotifyAPI';
import API from '../../utils/API';
import './style.css';

const Player = props => {
	const [currentProgress, setCurrentProgress] = useState(
		(props.track.progress / props.track.duration) * 100
	);

	const addToProgressBar = () => {
		if (props.trackPlaying) {
			let progress = props.track.progress;
			let duration = props.track.duration;
			const progressInterval = setInterval(() => {
				progress += 1000;
				const updatedProgress = (progress / duration) * 100;

				if (updatedProgress >= 99) clearInterval(progressInterval);

				setCurrentProgress(updatedProgress);
			}, 1000);
		}
	};

	const handleNextClick = async () => {
		try {
			await API.updateTrackPlayedStatus(props.roomId, props.track.id);
			await SpotifyAPI.nextPlaybackTrack(props.token);
			window.location.reload();
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(addToProgressBar, [props.track, props.trackPlaying]);

	return (
		<div className="now-playing-container">
			<div className="pt-2 mb-4 text-center">
				<div className="now-playing-name">{props.track.name}</div>
				<div className="now-playing-artist">{props.track.artists[0]}</div>
			</div>
			{props.trackPlaying ? (
				<>
					<ProgressBar
						animated
						now={currentProgress}
						variant="success"
						className="mx-auto mb-2"
						style={{ height: '10px', width: '70%' }}
					/>
					<div className="text-center player-buttons">
						<button
							type="button"
							className="btn"
							onClick={() => {
								console.log('like!');
							}}>
							<i className="fa fa-heart fa-2x"></i>
						</button>
						<button
							type="button"
							className="btn"
							onClick={() => {
								console.log('comment!');
							}}>
							<i className="fa fa-comment fa-2x"></i>
						</button>
						<button
							type="button"
							className="btn"
							onClick={() => {
								handleNextClick();
							}}>
							<i className="fa fa-forward fa-2x"></i>
						</button>
					</div>
				</>
			) : null}
		</div>
	);
};

export default Player;
