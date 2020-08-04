import axios from 'axios';

export default {
	createRoom: roomId => {
		return axios.post('/api/rooms', {
			room_id: roomId
		});
	},
	getTracks: roomId => {
		return axios.get(`/api/rooms/${roomId}`);
	}
};
