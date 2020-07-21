import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import Login from './pages/Login';
import Home from './pages/Home';

import './App.css';

function App() {
	return (
		<Router>
			<Route exact path={["/", "/login"]} component={Login} />
			<Route exact path="/home" component={Home} />
		</Router>
	);
}


export default App;
