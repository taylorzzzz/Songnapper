import * as actionTypes from '../actions/actionTypes';

const initialState = {
	track: null,
	connection: null,
}

const trackReducer = (state = initialState, action) => {

	switch (action.type) {
		case actionTypes.GET_TRACK : {
			return {
				...state,
				track: action.track,
			}
		}
		default: return state;
	}
}

export default trackReducer;