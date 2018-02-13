import * as actionTypes from '../actions/actionTypes';


const intitialState = {
	user: null,
	user_exists: true,
	uploading_avatar: false,
}

const userReducer = (state = intitialState, action) => {
	switch(action.type) {
		case (actionTypes.GET_USER_SUCCESS) : {
			return {
				...state, 
				user: action.user,
				user_exists: true
			}
		}
		case (actionTypes.GET_USER_FAILED) : {
			return {
				...state, 
				user: null,
				user_exists: false
			}
		}
		case (actionTypes.UPLOADING_AVATAR) : {
			return {
				...state,
				uploading_avatar: true
			}
		}
		case (actionTypes.UPLOAD_COMPLETE) : {
			return {
				...state,
				uploading_avatar: false
			}
		}
		default : {
			return {...state}
		}
	}
}

export default userReducer;