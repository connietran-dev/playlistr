import axios from 'axios';

export default {
	getUserData: token => {
		return axios({
			method: 'GET',
			url: 'https://api.spotify.com/v1/me',
			headers: {
				Authorization: 'Bearer ' + token
			}
		});
	},
	getUserQueueData: token => {
		return axios({
			method: 'GET',
			url: 'https://api.spotify.com/v1/me/player',
			headers: {
				Authorization: 'Bearer ' + token
			}
		});
	},
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
