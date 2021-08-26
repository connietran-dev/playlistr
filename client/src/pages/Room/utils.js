import SpotifyAPI from '../../utils/SpotifyAPI';

export default {
	getCurrentTrack: async token => {
		try {
			const { data } = await SpotifyAPI.getUserQueueData(token);

			if (data) {
				const trackObj = {
					id: data.item.id,
					name: data.item.name,
					duration: data.item.duration_ms,
					progress: data.progress_ms,
					albumImages: data.item.album.images.map(image => image.url),
					artists: data.item.album.artists.map(artist => artist.name)
				};
				return {
					trackData: trackObj,
					isPlaying: data.is_playing,
					timeRemaining: trackObj.duration - trackObj.progress + 500
				};
			} else
				return {
					trackData: null,
					isPlaying: null,
					timeRemaining: null
				};
		} catch (err) {
			console.log(err);
			return {
				trackData: null,
				isPlaying: null,
				timeRemaining: null
			};
		}
	}
};
