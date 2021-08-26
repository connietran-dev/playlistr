import SpotifyAPI from './SpotifyAPI';

export default {
	user: async token => {
		try {
			const { data } = await SpotifyAPI.getUserData(token);
			if (Object.keys(data)[0]) {
				const currentUser = {
					name: data.display_name,
					id: data.id,
					url: data.external_urls.spotify,
					image:
						data.images && data.images[0]
							? data.images[0].url
							: '/images/icons/playlistr-icon.png'
				};

				return currentUser;
			} else return {};
		} catch (err) {
			console.log(err);
			return {};
		}
	}
};
