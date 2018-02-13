import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Redirect, Switch } from 'react-router-dom';

import User from '../../components/User/User';
import EditUser from '../../components/User/EditUser/EditUser';

import * as actions from '../../store/actions';

class UserPage extends Component {

	constructor(props) {
		super(props);

		this.state = {
			user: null,
			currentUser: null,
			userExists: true,
			activeTab: "connections"
		}

		this.tabClickHandler = this.tabClickHandler.bind(this);
	}

	componentWillMount() {
		// fetch the user details when the page first mounts
		// even if the user is the same as current_user
		this.props.getUser(this.props.match.params.id);
		this.setState({currentUser: this.props.currentUser});
	}
	componentWillReceiveProps(nextProps) {
		// First check if there has been a url change - ie we go from one users page 
		// straight to another users page.
		if (nextProps.location.pathname !== this.props.location.pathname) {
			// if the Route changed then the user will be still set to the 
			// user from the previous route. We need to re call getUser and 
			// reset the user state to null
			this.props.getUser(nextProps.match.params.id);
			this.setState({user: null});
		}
		// We then check if the new props we received were for an updated user 
		// - ie getUser dispatch finished and updated user in redux 
		if (nextProps.user && (this.props.user !== nextProps.user)) {
			this.setState({user: nextProps.user});
			// if it wasn't user that changed it is probably currentUser 
			// that has been retreived from redux and so we first check that it 
			// not equal to null - which it would be if it hasn't changed yet
		} else if (nextProps.currentUser !== null) {
			// if it is not null than it is either "" - empty string
			// meaning no user is currently logged in - or it will be an 
			// object representing the currently logged in user

			if (nextProps.currentUser) { 
				this.setState({currentUser: nextProps.currentUser })
			} else {
				this.setState({currentUser: ""});
			}
		}
		if (nextProps.userExists !== this.props.userExists) {
			this.setState({userExists: nextProps.userExists})
		}
	}

	tabClickHandler(tab) {
		this.setState({activeTab: tab});
	}

	render() {
		const userPage = (
					this.state.user
						? <User user={this.state.user} 
								currentUser={this.state.currentUser} 
								clicked={this.tabClickHandler} 
								activeTab={this.state.activeTab}
								/>
						: this.state.userExists === false
							? <Redirect to="/" />
							: null
						);
		const editUser = this.state.user ? <EditUser user={this.state.user} /> : null;
		
		return (
			<div>
				{
					this.props.uploadingAvatar 
						? <div>uploading ...</div>
						: (
							<Switch>
								<Route path={`${this.props.match.url}/edit`} render={() => <h1>{editUser}</h1> } />
								<Route path={`${this.props.match.url}/`} render={ () => <div>{userPage}</div> } />
							</Switch>)
				}
			</div>
		)
	}
}

const mapStateToProps = state => {
	return {
		currentUser: state.auth.currentUser,
		user: state.user.user,
		userExists: state.user.user_exists,
		uploadingAvatar: state.user.uploading_avatar
	}
}

const mapDispatchToProps = dispatch => {
	return {
		getUser: (id) => dispatch(actions.getUser(id)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(UserPage);

