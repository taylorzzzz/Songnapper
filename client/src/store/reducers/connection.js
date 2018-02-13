import * as actionTypes from '../actions/actionTypes';

const initialState = {
	connection: null,
	submittedBy: null,
	comments: null
}

const connectionReducer = (state = initialState, action) => {
	switch (action.type) {

		case actionTypes.SAVE_CONNECTION : {
			return {...state, connection: action.connection }
		}
		case actionTypes.SUBMITTED_BY : {
			return {...state, submittedBy: action.user}
		}
		case actionTypes.VOTE_SUCCESS : {
			return { ...state, connection: action.connection }
		}
		case actionTypes.SUBMIT_COMMENT_SUCCESS : {
			return { ...state, connection: action.connection }
		}
		case actionTypes.SAVE_COMMENTS : {
			return {...state, comments: action.comments}
		}
		default: return state;
	}
}

export default connectionReducer;