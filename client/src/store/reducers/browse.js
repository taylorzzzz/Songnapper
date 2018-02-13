import * as actionTypes from '../actions/actionTypes';

const intitialState = {
	currentCategory: null,			// stores the current browse page's category (decade, type, genre)
	currentSubcategory: null,		// stores the current browse page's subcategory (1990, bassline, funk) - or null if we are only at the category level 

	subcategories: null,			// stores all of the subcategories (all genres, all decades, all types)  
	isFetching: false,				// true while subcategories are being fetched.

	tracks: null,					// stores the tracks that match browse criteria (cat and subcat)
	connections: null,				// stores the connections that match our browse criteria (cat and subcat)

	trackConFilter: 'connections',	// the state of the track/connection filter - either 'connections' or 'tracks'
	sortFilter: null,				// the state of the sort filter - 
	
	totalConnectionCount: null,		// Total # of connection results. Used for connections pagination
	totalTrackCount: null,			// Total # of track results. Used for tracks pagination
	currentPage: 0,					// The current connection results page.
	currentTrackPage: 0,			// The current track results page.
}

const browseReducer = (state = intitialState, action) => {

	switch (action.type) {

		
		case actionTypes.UPDATE_BROWSE_CATEGORY : {
			return {
				...state,
				currentCategory: action.category
			}
		}

		case actionTypes.REQUESTING_SUBCAT_LINKS : {
			return {
				...state,
				isFetching: true
			}
		}
		case actionTypes.SAVE_SUBCAT_LINKS : {
			return {
				...state,
				subcategories: action.subcategories,
				isFetching: false
			}
		}

		case actionTypes.SAVE_BROWSE_SUBCAT : {
			return {
				...state, 
				currentSubcategory: action.subcategory
			}
		}

		case actionTypes.SAVE_TRACKS : {
			return {
				...state,
				tracks: action.tracks,
				totalTrackCount: action.count,
				currentPage: action.currentPage,
			}
		}
		case actionTypes.SAVE_CONNECTIONS : {
			return {
				...state,
				connections: action.connections,
				totalConnectionCount: action.count,
				currentPage: action.currentPage
			}
		}

		case actionTypes.SAVE_LATEST : {
			return {
				...state, 
				connections: action.connections,
				totalConnectionCount: action.count,
				currentPage: action.currentPage
			}
		}
		case actionTypes.SAVE_TOP_RATED : {
			return {
				...state,
				connections: action.connections,
				totalConnectionCount: action.count,
				currentPage: action.currentPage
			}
		}
		case actionTypes.UPDATE_TRACK_CON_FILTER : {
			return {
				...state,
				trackConFilter: action.value
			}
		}
		case actionTypes.UPDATE_SORT_FILTER : {
			return {
				...state,
				sortFilter: action.value
			}
		}
		default : return state;
	}
}

export default browseReducer;