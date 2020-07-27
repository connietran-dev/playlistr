import React from 'react';
import './style.css';

const NowPlayingImg = props => {
	return (
		<div className="now-playing-img">
			<img src={props.item.album.images[0].url} alt="Track album artwork" />
		</div>
	);
};

export default NowPlayingImg;
