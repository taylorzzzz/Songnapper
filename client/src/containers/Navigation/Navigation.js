import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import * as actions from '../../store/actions';

import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';
import FullNavBar from '../../components/Navigation/FullNavBar';

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
		window.addEventListener('resize', this.onResize);
	}
	componentWillUnount() {
		window.removeEventListener("resize", this.onResize);
	}

	onResize = () => {
		this.setState({width: document.documentElement.clientWidth});
	}

	toggleSideDrawer = () => {
		this.setState({sideDrawerOpen: !this.state.sideDrawerOpen});
	}
	
	searchInputHandler = (e) => {
		this.setState({searchInput: e.target.value});
	}
	searchSubmitHandler = (e) => {
		e.preventDefault();
		// this.props.submitSearch(this.state.searchInput);
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
				// Here we want to render the NavigationBar / Sidebar based on width	
				this.state.width < 600
					? <div>
						<SideDrawer 
							open={this.state.sideDrawerOpen} 
							toggleSideDrawer={this.toggleSideDrawer} />
						<FullNavBar
							mobile
							hamburger={ <MenuButton clickHandler={this.toggleSideDrawer} dark /> }
							logo={ <Logo link="/" text="Songnapper" /> }
							auth={ <LoginLogout user={this.props.user} />} />
					</div>
					// Otherwise we render the full length navbar
					: <FullNavBar
						logo={ <Logo link="/" text="Songnapper" /> }
						menu={ navMenu } 
						search={ searchBar }
						auth={ <LoginLogout user={this.props.user} />} />
				)
	}
}

const mapDispatchToProps = dispatch => {
	return {
		submitSearch: (string) => dispatch(actions.search(string)),
	}
}

export default withRouter(connect(null, mapDispatchToProps)(Navigation));
