import API from '../../utils/API';

export default {
	getUnplayedTracks: async input => {
		try {
			const { data } = await API.getTracks(input);

			if (!data) return null;

			if (data.addedTracks[0]) {
				return data.addedTracks.filter(track => !track.played);
			}
			return [];
		} catch (err) {
			console.log('test', err);
			return null;
		}
	}
};
