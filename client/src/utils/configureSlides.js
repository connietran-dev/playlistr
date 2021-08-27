export default (arr, rowLength) => {
	let allSlides = [];
	let numSlides = arr.length / rowLength;

	for (let slideIndex = 0; slideIndex < numSlides; slideIndex++) {
		let currentSlide = [];

		for (let itemIndex = 0; itemIndex < rowLength; itemIndex++) {
			let playlist = arr[itemIndex];
			if (playlist !== undefined) currentSlide.push(playlist);
		}

		arr.splice(0, rowLength);

		allSlides.push(currentSlide);
	}

	return allSlides;
};
