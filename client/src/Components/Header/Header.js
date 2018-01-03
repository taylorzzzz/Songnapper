import React from 'react';
import { Link } from 'react-router-dom';
import NavLink from './NavLink.js';
import Logo from './Logo';
import LoginRegister from './LoginRegister';
import './Header.css';

class Header extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loggedIn: this.props.loggedIn,
			user: this.props.user
		}
	}
	render() {
		return (
			<div className="Header">
				<div className="Header-left">
					<Link to="/" style={{textDecoration:'none'}}><Logo /></Link>
					<nav className="main-menu">
						<NavLink to="/browse">Browse</NavLink>
						<NavLink to="/top">Top</NavLink>
						<NavLink to="/tropes">Tropes</NavLink>
						<NavLink to="/addConnection">Add Connection</NavLink>
						<NavLink to="/restricted">Restricted</NavLink>
					</nav>
				</div>
				<div className="Header-right">
					<LoginRegister loggedIn={this.state.loggedIn} user={this.state.user}/>
				</div>
			</div>
		)	
	}
}

export default Header;