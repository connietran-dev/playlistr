import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Login from './pages/Login/index';
import Home from './pages/Home/index';
import Room from './pages/Room/index';

import './App.css';

function App() {
	return (
		<Router>
			<Route exact strict path={['/', '/login']} component={Login} />
			<Route exact strict path="/home" component={Home} />
			<Route path="/room" component={Room} />
		</Router>
	);
}

export default App;
