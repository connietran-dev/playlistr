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
	getUserPlaylists: (token, limit) => {
		return axios({
			method: 'GET',
			url: `https://api.spotify.com/v1/me/playlists?limit=${limit}`,
			headers: {
				Authorization: 'Bearer ' + token
			}
		})
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
	},
	playPausePlayback: (action, token) => {
		return axios({
			method: 'PUT',
			url: `https://api.spotify.com/v1/me/player/${action}`,
			headers: {
				Authorization: 'Bearer ' + token,
				'Content-Type': 'application/json'
			}
		});
	},
	nextPlaybackTrack: token => {
		return axios({
			method: 'POST',
			url: 'https://api.spotify.com/v1/me/player/next',
			headers: {
				Authorization: 'Bearer ' + token,
				'Content-Type': 'application/json'
			}
		});
	},
	trackSearch: (token, track) => {
		return axios({
			method: 'GET',
			url: `https://api.spotify.com/v1/search?q=${track}&type=track&limit=20`,
			headers: {
				Authorization: 'Bearer ' + token
			}
		});
	},
	getPlaylistTracks: (token, playlistId) => {
		return axios({
			method: 'GET',
			url: `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=100`,
			headers: {
				Authorization: 'Bearer ' + token
			}
		});
	}
};
