import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';

import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';
import NavigationBar from '../../components/Navigation/NavigationBar';
import Logo from '../../components/Navigation/Logo/Logo';
import LoginLogout from '../../components/Navigation/LoginLogout/LoginLogout';
import MenuButton from '../../components/UI/Button/MenuButton';
import NavMenu from '../../components/Navigation/NavMenu/NavMenu';
import SearchBar from '../../components/UI/SearchBar/SearchBar';

class Navigation extends Component {
	constructor(props) {
		super(props);
		this.state = {
			sideDrawerOpen: false,
			width: window.document.documentElement.clientWidth,
			searchInput: "",
		}
	}
	componentDidMount() {
		// Set resize eventListener so that we can adjust type of navbar if we need to
		window.addEventListener('resize', this.onResize);
	}
	componentWillUnount() {
		window.removeEventListener("resize", this.onResize);
	}

	onResize = () => {
		// Update clientWidth which is used to determine if we need mobile nav or not
		this.setState({width: document.documentElement.clientWidth});
	}

	toggleSideDrawer = () => {
		this.setState({sideDrawerOpen: !this.state.sideDrawerOpen});
	}
	
	searchInputHandler = (e) => {
		this.setState({searchInput: e.target.value});
	}
	searchSubmitHandler = (e) => {
		e.preventDefault();		// Prevents page from reloading
		this.props.history.push('/search/' + this.state.searchInput);
	}



	render() {
		
		const navMenu = (
			<NavMenu>
				<NavLink to="/browse/top">Top</NavLink>
				<NavLink to="/browse/latest">Latest</NavLink>
				<NavLink to="/browse">Browse</NavLink>
				<NavLink to="/submit-connection">Submit</NavLink>
			</NavMenu>
		)
		const searchBar = (
			<SearchBar 
				nav 	
				placeholder="Search Connections"
				value={this.state.searchInput}
				changeHandler={this.searchInputHandler}
				clickHandler={this.searchSubmitHandler} />
		)


		return (
				// If screen width is < 600 (mobile)...
				this.state.width < 600
					// ... then render the Sidedrawer (hidden) and 
					// the Navbar with the mobile prop and the hamburger prop
					? <div>
						<SideDrawer 
							open={this.state.sideDrawerOpen} 
							toggleSideDrawer={this.toggleSideDrawer} />
						<NavigationBar
							mobile
							hamburger={ <MenuButton clickHandler={this.toggleSideDrawer} dark /> }
							logo={ <Logo link="/" text="Songnapper" logo=""/> }
							auth={ <LoginLogout user={this.props.user} />} />
					</div>
					// Otherwise render normal Navbar along with the 
					// Navmenu and Searchbar
					: <NavigationBar
						logo={ <Logo link="/" text="Songnapper" /> }
						auth={ <LoginLogout user={this.props.user} />}
						menu={ navMenu } 
						search={ searchBar }
						 />
				)
	}
}

export default withRouter(Navigation);
