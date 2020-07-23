const express = require('express');
const compression = require('compression');

const routes = require('./routes');
const app = express();
const port = process.env.PORT || 8888;

if (process.env.NODE_ENV === 'production') {
	app.use(express.static('client/build'));
}

app.use(routes);
app.use(compression());

console.log(`Listening on port ${port}.`);
app.listen(port);
