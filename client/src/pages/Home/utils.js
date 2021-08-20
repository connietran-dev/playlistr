import SpotifyAPI from '../../utils/SpotifyAPI';

export default {
	getPlaylists: async token => {
		try {
			const { data } = await SpotifyAPI.getUserPlaylists(token, 20);

			if (data && data.items[0]) {
				const playlists = [...data.items].map(playlist => {
					if (!playlist.images[0])
						playlist.images.push({
							url: '/images/icons/playlistr-icon.png'
						});

					return playlist;
				});

				return playlists;
			} else return [];
		} catch (err) {
			console.log(err);
			return [];
		}
	},
	verifySpotifyActive: async token => {
		try {
			const { data } = await SpotifyAPI.getUserQueueData(token);

			if (data && data.is_playing) return true;
			else return false;
		} catch (err) {
			console.log(err);
			return false;
		}
	}
};
