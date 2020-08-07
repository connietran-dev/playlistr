import axios from 'axios';

export default {
	createRoom: roomId => {
		return axios.post('/api/rooms', {
			room_id: roomId
		});
	},
	getTracks: roomId => {
		return axios.get(`/api/rooms/${roomId}`);
	},
	updateTrackPlayedStatus: (roomId, trackId) => {
		return axios.put(`/api/rooms/${roomId}/${trackId}`);
	},
	updateNowPlaying: (roomId, trackId) => {
		return axios.put(`/api/rooms/${roomId}/playing/${trackId}`);
	},
	updateSongProgress: (roomId, trackId, progress) => {
		return axios.put(`/api/rooms/${roomId}/progress/${trackId}/${progress}`);
	},
	addTrack: (roomId, trackId, trackInfo) => {
		return axios.put(`/api/rooms/${roomId}`, {
			info: trackInfo,
			spotifyId: trackId
		});
	}
};
