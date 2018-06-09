import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import * as actions from '../../../store/actions';
import * as classes from './EditUser.css';

import UserInfo from '../UserInfo/UserInfo';

/*
	This component is displayed to allow a user to edit their profile
	(username, bio and avatar).
*/
class EditUser extends Component {

	constructor(props) {

		super(props);

		this.state = {
			
			username: props.user.username,		// signed in user's username
			bio: props.user.bio,				// signed in user's bio
			validUsername: true,				// true if updated username is valid
			usernameTaken: false,				// true if username already taken
			invalidCharacters: false,			// true if invalid (!@# ...) are present
			tooShort: false,					// true if username < 3 characters
			tooLong: false,						// true if username > 15 characters
			validBio: true,						// true if bio is valid
			validUpdate: true,					// true if all updates are valid
			avatarSrc: props.user.avatar,		// the remote src of avatar
			avatarChanged: false,				// true if avatar has changed

		}

	}

	componentWillReceiveProps(nextProps) {

		// If usernameAvailable value is changing...
		if (nextProps.usernameAvailable !== this.props.usernameAvailable) {

			// change usernameTaken value too.
			this.setState({usernameTaken: !this.state.usernameTaken});

			// Then try to validate the username, with the updated usernameAvailable value
			this.validateUsername(this.state.username, nextProps.usernameAvailable);

		} 

		/* Not sure if this does anything so I'll comment it out for now
		else if (nextProps.user.avatar === this.props.user.avatar) {
			console.log('avatar changed');
			this.setState({avatarSrc: nextProps.user.avatar})
		}
		*/
	}

/* This method is called when username or bio is changed */
	handleEdit = (name, value) => {

		// Name will either be bio or username. Whichever it is update to value.
		this.setState({[name]: value});
		
		// If we are editing username, first check if username is available
		if (name === 'username') {

			this.props.checkUsername(value);

			this.validateUsername(value);

		}

	}
/* This method ultimately updates the state to reflect which parts of username are valid */
	// This could probably be farmed out to multiple functions
	validateUsername = (value, available) => {

		// Set whether or not username is available
		const usernameAvailable = available || this.props.usernameAvailable;

		// Set value of username we are checking
		const username = value;

		// First check is that username is valid length
		if (username.length >= 3 && username.length <= 15) {

			// Then check if username only contains valid characters
			if (username.match( /^[A-Za-z0-9_]{1,15}$/) ) {

				// Then check if this (valid) username is available
				if (usernameAvailable) {

					// If it is then we can update the state to reflect that username is valid
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

/* Called once the user clicks Save */
	handleSaveClick = () => {

		// First check if the avatar has changed. 
		const avatar = this.props.user.avatar === this.state.avatarSrc 

			? this.props.user.avatar 	// If it hasn't, keep avatar the same

			: this.state.avatarSrc;		// If it has changed, use the updated avatar

		// Remove <tags> and &nbsp; (non-breaking space)
		// Probably not the best way to do this but works for now
		let bio = this.state.bio;

		bio = bio.replace(/<\w+>/g, ' ');

		bio = bio.replace(/&nbsp;/g, ' ');
	
		// Dispatch the action that saves our edits
		this.props.saveEdit(this.props.user._id, this.state.username, bio.trim(), avatar, this.state.avatarChanged);
		
		// Finally go back to the user's page.
		this.props.history.goBack();

	}

/* Handle cancel button click */
	handleCancelClick = () => {

		this.props.history.goBack();

	}

/* Handle Avatar edit click */
	handleAvatarClick = (ref) => {

		ref.click();

	}

/* Called when user selects an image to upload */
	handleAvatarUpload = (event, imgRef) => {

		// First get the file selected 
		const file = event.target.files[0];

		// Then create a new FileReader to read in that file
		let reader = new FileReader();

		// Tell that reader that upon loading the file, setState with it's contents
		reader.onload = (e) => {

			this.setState({avatarSrc: e.target.result, avatarChanged: true});

		}

		// Finally, read in the file as a DataURL
		reader.readAsDataURL(file);

	}


	render() {

		let errorMessages = [];

		// Set the error message(s)
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
					editable 
					user={this.props.user} 
					validUsername={this.state.validUsername}
					avatarSrc={this.state.avatarSrc}
					// Methods
					onEdit={this.handleEdit}
					onSave={this.handleSaveClick}
					onCancel={this.handleCancelClick}
					uploadAvatar={this.handleAvatarClick}
					uploaded={this.handleAvatarUpload} />


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


