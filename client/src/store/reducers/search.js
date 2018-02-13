import * as actionTypes from '../actions/actionTypes';


const initialState = {
	searchResults: null,
	totalResultCount: null,
	currentPage: null,
}

const searchReducer = (state = initialState, action) => {

	switch(action.type) {

		case actionTypes.SAVE_SEARCH_RESULTS :  {
			return {
				...state, 
				searchResults: action.results,
				currentPage: action.page,
				totalResultCount: action.resultCount,
			};
		}
		default: return state;
	}
}

export default searchReducer;