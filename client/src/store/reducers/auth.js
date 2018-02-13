import * as actionTypes from '../actions/actionTypes';


const initialState = {
	currentUser: null,					// The currently signed in user. 
	loggedOut: null,
	login_fail: false,
	register_fail: false,
	usernameAvailable: false,
	needsUsername: false,				// True when user signs up with Social without creating username
}

const authReducer = (state = initialState, action) => {

	switch(action.type) {

		case actionTypes.SAVE_CURRENT_USER : {				// Saves user returned by getCurrentUser()
			return {
				...state,
				currentUser: action.user,
				needsUsername: action.needsUsername,
				loggedOut: !action.user,
				login_fail: false,
				register_fail: false,
				usernameAvailable: false,
			}
		}
		case actionTypes.USERNAME_TAKEN : {
			return { ...state, usernameAvailable: false }
		}
		case actionTypes.USERNAME_AVAILABLE : {
			return { ...state, usernameAvailable: true }
		}
		case actionTypes.LOGIN_FAILED : {
			return { ...state, login_fail: true }
		}
		case actionTypes.REGISTER_FAILED : {
			return { ...state, register_fail: true }
		}
		case actionTypes.LOGOUT_SUCCESSFUL : {
			return {
				...state, 
				currentUser: '',
				loggedOut: true
			}
		}
		case actionTypes.VOTE_SUCCESS : {
			return { ...state, currentUser: action.user }
		}

		default : return { ...state }
	}
}


export default authReducer;
