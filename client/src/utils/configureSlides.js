export default (playlists, rowLength) => {
	let allSlides = [];
	let numSlides = playlists.length / rowLength;

	for (let slideIndex = 0; slideIndex < numSlides; slideIndex++) {
		let currentSlide = [];

		for (let itemIndex = 0; itemIndex < rowLength; itemIndex++) {
			let playlist = playlists[itemIndex];
			if (playlist !== undefined) currentSlide.push(playlist);
		}

		// Remove first 'rowLength' playlists from array in order to add next 'rowLength' playlists to next slide, etc.
		playlists.splice(0, rowLength);

		allSlides.push(currentSlide);
	}

	return allSlides;
};
