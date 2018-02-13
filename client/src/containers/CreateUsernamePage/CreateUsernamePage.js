import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import UsernameForm from '../../components/UI/Form/UsernameForm';

class CreateUsernamePage extends Component {

	render() {
		console.log(this.props.user);
		return (
			<div>
				{
					this.props.user 
					? this.props.user.username ? <Redirect to="/" /> : null
					: <Redirect to="/" />
				}
				<UsernameForm user={this.props.user}/>
			</div>
		)
	}
}

const mapStateToProps = state => {
	return {
		user: state.auth.currentUser
	}
}
export default connect(mapStateToProps)(CreateUsernamePage);