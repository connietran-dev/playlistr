const express = require('express');
const routes = require('./routes');
const app = express();
const port = process.env.PORT || 8888;

if (process.env.NODE_ENV === 'production') {
	app.use(express.static('client/build'));
}

app.use(routes);

console.log(`Listening on port ${port}.`);
app.listen(port);
