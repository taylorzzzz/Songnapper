import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, browserHistory } from 'react-router-dom';
import axios from 'axios';



import './App.css';
import Header from './Header/Header';
import Home from './Home/Home';
import Browse from './Browse/Browse';
import Login from './Login_Register/Login';
import Register from './Login_Register/Register';
import AddConnection from './Connection/AddConnection';
import NotFound from './NotFound';
// For testing authentication
import Restricted from './Restricted.js';

class App extends Component {
	render () {
		return (
			<BrowserRouter>
				<div className="App">	
					<Header loggedIn={false} user={null}/>
					<Switch>
						<Route exact path="/" component={Home} />
						<Route exact path="/login" component={Login} />
						<Route exact path="/register" component={Register} />
						<Route exact path="/browse" component={Browse} />
						<Route exact path="/addConnection" component={AddConnection} />
						<Route exact path="/restricted" component={Restricted} />
						<Route path="*" component={NotFound} />
					</Switch>

				</div>
			</BrowserRouter>
		)
	}
}

export default App;
