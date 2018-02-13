import axios from 'axios';
import * as actionTypes from './actionTypes';


// action creators for logging in and registering via email/password
export const submitLogin = (email, password) => {
	const data = {
		email: email,
		password: password
	}
	return dispatch => {
		axios.post('/auth/email/login', data)
			.then(response => {
				return dispatch(getCurrentUser());
			})
			.catch(err => {
				console.log('there was an error trying to login in');
				console.log(err);
				return dispatch(loginFailed());
			})
	}
}
export const submitRegister = (username, email, password) => {
	const data = {
		username: username,
		email: email,
		password: password
	}
	return dispatch => {
		axios.post('/auth/email/register', data)
			.then(response => {
				dispatch(getCurrentUser());
			})
			.catch(err => {
				console.log('error registering');
				dispatch(registerFailed());
			})
	}
}
export const checkUsername =(username) => {
	const url = '/auth/checkUsername/' + username;
	return dispatch => {
		axios.get(url)
			.then(response => {
				if (response.data.usernameTaken) {
					// username is taken
					return dispatch(usernameTaken());
				}
				return dispatch(usernameAvailable());
			})
			.catch(err => {
				console.log('err');
				console.log(err);
			})
	}
}
export const createUsername = (username, id) => {
	const data = {username: username, id: id};
	return dispatch => {
		axios.post('/auth/createUsername', data)
		.then(response => {
			dispatch(saveCurrentUser(response.data));
		})
		.catch(err => {
			console.log(err);
		})
	}
}


const usernameTaken = () => {
	return {
		type: actionTypes.USERNAME_TAKEN
	}
}
const usernameAvailable = () => {
	return {
		type: actionTypes.USERNAME_AVAILABLE
	}
}
const registerFailed =() => {
	return {
		type: actionTypes.REGISTER_FAILED,
	}
}
const loginFailed = () => {
	return {
		type: actionTypes.LOGIN_FAILED
	}
}


export const getCurrentUser = () => {
	return dispatch => {
		axios.get('/auth/current_user')
			.then(response => {
				dispatch(saveCurrentUser(response.data));
			})
			.catch(err => {
				console.log('error', err);
			})
	}
} 
const saveCurrentUser = (user) => {
	const needsUsername =  user.username ? false : true;		// For Social Signups who haven't created username yet
	return {
		type: actionTypes.SAVE_CURRENT_USER,
		user: user,
		needsUsername: needsUsername,
	}
}

export const logout = () => {
	return dispatch => {
		axios.get('/auth/logout')
			.then(response => {
				dispatch(logout_successful())

			})
	}
}
const logout_successful = () => {
	return {
		type: actionTypes.LOGOUT_SUCCESSFUL,
	}
}