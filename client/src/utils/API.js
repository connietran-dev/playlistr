import axios from 'axios';

export default {
	getTracks: roomId => {
		return axios.get(`/api/rooms/${roomId}`);
	}
};
