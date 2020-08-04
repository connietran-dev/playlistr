import axios from 'axios';

export default {
	addTrackToQueue: (token, trackId) => {
		return axios({
			method: 'POST',
			url: `https://api.spotify.com/v1/me/player/queue?uri=spotify:track:${trackId}`,
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
	}
};
