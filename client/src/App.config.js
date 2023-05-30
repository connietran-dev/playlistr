const apiUrlOptions = {
  prod: 'https://playlistr-io.herokuapp.com',
  dev: 'http://localhost:8888',
};

const apiURL = window.location.hostname === 'localhost' ? apiUrlOptions.dev : apiUrlOptions.prod;

export { apiURL };
