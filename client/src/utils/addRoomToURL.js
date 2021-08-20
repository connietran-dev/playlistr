export default (homeUrl, token, hex) => {
	// let homeUrl = window.location.href;

	homeUrl === `http://localhost:3000/home?access_token=${token}`
		? window.location.replace(
				`http://localhost:3000/room?access_token=${token}&room_id=${hex}`
		  )
		: homeUrl ===
		  `https://playlistr-io.herokuapp.com/home?access_token=${token}`
		? window.location.replace(
				`http://playlistr-io.herokuapp.com/room?access_token=${accessToken}&room_id=${hex}`
		  )
		: console.log('URL Error');
};
