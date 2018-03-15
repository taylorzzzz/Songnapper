import * as actionTypes from '../actions/actionTypes';


const intitialState = {
	featured: null,
}

const homeReducer = (state = intitialState, action) => {

	switch(action.type) {
		case actionTypes.SAVE_FEATURED: {
			return {
				...state, 
				featured: action.connection
			}
		}
		case actionTypes.SAVE_FEATURED_LATEST: {
			return {
				...state, 
				latest: action.connections
			}
		}
		default: return state;
	}
}

export default homeReducer;