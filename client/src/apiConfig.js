let apiUrl;

const apiUrls = {
	production: 'https://playlistr-io.herokuapp.com',
	development: 'http://localhost:8888'
};

if (window.location.hostname === 'localhost') {
	apiUrl = apiUrls.development;
} else {
	apiUrl = apiUrls.production;
}

export default apiUrl;
