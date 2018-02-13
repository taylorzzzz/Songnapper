import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import * as actions from '../../../store/actions';
import * as classes from './EditUser.css';

import UserInfo from '../UserInfo/UserInfo';
// import ContentEditable from '../../UI/ContentEditable/ContentEditable';

class EditUser extends Component {

	constructor(props) {
		super(props);

		this.state = {
			username: props.user.username,
			bio: props.user.bio,
			validUsername: true,
			usernameTaken: false,
			invalidCharacters: false,
			tooShort: false,
			tooLong: false,
			validBio: true,
			validUpdate: true,
			avatarSrc: props.user.avatar,
			avatarChanged: false,
		}

		// need loadash for this
		//bindAll(this, 'onEdit', 'onSave', 'onCancel', 'uploadAvatar', 'uploaded');

		this.onEdit = this.onEdit.bind(this);
		this.onSave = this.onSave.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.uploadAvatar = this.uploadAvatar.bind(this);
		this.uploaded = this.uploaded.bind(this);
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.usernameAvailable !== this.props.usernameAvailable) {
			this.setState({usernameTaken: !this.state.usernameTaken});
			this.validateUsername(this.state.username, nextProps.usernameAvailable);
		} else if (nextProps.user.avatar === this.props.user.avatar) {
			this.setState({avatarSrc: nextProps.user.avatar})
		}
	}


	onEdit(name, value) {
		this.setState({[name]: value});

		// if we are editing username, first check if username is available
		if (name === 'username') {
			this.props.checkUsername(value);
			this.validateUsername(value);
		}
	}
	validateUsername(value, available) {
		const usernameAvailable = available || this.props.usernameAvailable;

		const username = value;
		if (username.length >= 3 && username.length <= 15) {
			if (username.match( /^[A-Za-z0-9_]{1,15}$/) ) {
				if (usernameAvailable) {
					this.setState({validUsername: true, invalidCharacters: false, usernameTaken: false, tooShort: false,tooLong:false});
				} else {
					this.setState({validUsername: false, usernameTaken: true, invalidCharacters: false, tooShort: false,tooLong:false })
				}
			} else {
				this.setState({invalidCharacters: true, validUsername: false, usernameTaken: false, tooShort: false,tooLong:false })
			}	
		} else {
			this.setState({validUsername: false, tooShort: username.length < 3, tooLong: username.length > 15})
		}
	}
	onSave() {
		// first check if the avatar has changed 
		console.log(this.state.bio);
		const avatar = this.props.user.avatar === this.state.avatarSrc ? this.props.user.avatar : this.state.avatarSrc;
		this.props.saveEdit(this.props.user._id, this.state.username, this.state.bio.trim(), avatar, this.state.avatarChanged);
		this.props.history.goBack();
	}
	onCancel() {
		this.props.history.goBack();
	}
	uploadAvatar(ref) {
		ref.click();
	}
	uploaded(event, imgRef) {
		const file = event.target.files[0];
		let reader = new FileReader();
		reader.onload = (e) => {
			this.setState({avatarSrc: e.target.result, avatarChanged: true});
		}
		reader.readAsDataURL(file);
	}

	render() {
		let errorMessages = [];
		if (this.state.usernameTaken) errorMessages.push("That username is already taken.");
		if (this.state.invalidCharacters) errorMessages.push("Username may only contain letters, numbers and underscore ( _ )");
		if (this.state.tooShort) errorMessages.push("Username must be at least 3 characters long");
		if (this.state.tooLong) errorMessages.push("Username must be less the 15 characters long");


		return (
			<div>
				{
					this.state.validUsername
						? null
						: errorMessages.map((m,i) => {
								return <div key={i}className={classes.ErrorMessage}>{m}</div>
							})
				}
				<UserInfo 
					user={this.props.user} 
					editable 
					onEdit={this.onEdit}
					onSave={this.onSave}
					onCancel={this.onCancel}
					validUsername={this.state.validUsername}
					uploadAvatar={this.uploadAvatar}
					uploaded={this.uploaded}
					avatarSrc={this.state.avatarSrc}/>
			</div>
		)
	}
}

const mapDispatchToProps = dispatch => {
	return {
		saveEdit: (id, username, bio, avatar, avatarChanged) => dispatch(actions.editUserInfo(id, username, bio, avatar, avatarChanged)),
		checkUsername: (username) => dispatch(actions.checkUsername(username)),
	}
}

const mapStateToProps = state => {
	return {
		usernameAvailable: state.auth.usernameAvailable,
	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditUser));


