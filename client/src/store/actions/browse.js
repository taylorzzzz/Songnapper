import axios from 'axios';
import * as actionTypes from './actionTypes';

// Get the Browse Category
export const updateBrowseCategory = (cat) => {
	return {
		type: actionTypes.UPDATE_BROWSE_CATEGORY,
		category: cat
	}
}


// Get all of the Subcategories - all genres, decades and types in db 
export const getSubCatLinks = () => {
	return (dispatch, getState) => {
		// First dispatch an action that indicates that we are currently
		// requesting the Subcategories.
		dispatch(requestingSubCatLinks());

		// Then send the request to the back end.
		axios.get('/api/browse/getSubcategories')
			.then(response => {
				// Saves the subcategories to redux store.
				dispatch(saveSubCatLinks(response.data));
			})
			.catch(err => {
				console.log('ERROR:', err);
			})
	}
}
const requestingSubCatLinks = () => {
	return {
		type: actionTypes.REQUESTING_SUBCAT_LINKS
	}
}
const saveSubCatLinks = (subcategories) => {
	return {
		type: actionTypes.SAVE_SUBCAT_LINKS,
		subcategories: subcategories
	}
}


// Update the Browse SubCategory
export const updateBrowseSubCat = (category, subcategory, sort, page) => {
	return dispatch => {
		dispatch(saveBrowseSubCat(subcategory));
		if (subcategory) {

			// Don't bother getting tracks if category is 'types'
			if (category !== 'types') {
				dispatch(getTracks(category, subcategory, sort, page));
			}
			dispatch(getConnections(category, subcategory, sort, page));
		}
	}
}
const saveBrowseSubCat = (subcat) => {
	return {
		type: actionTypes.SAVE_BROWSE_SUBCAT,
		subcategory: subcat
	}
}

// Get all tracks that fit the subcategory.
export const getTracks = (category, subcategory, sort = "latest", page = 0) => {
	return dispatch => {
		const url = `/api/browse/getSubcategoryTracks?category=${category}&subcategory=${subcategory}&sort=${sort}&page=${page}`;

		return axios.get(url)
			.then(response => {
				dispatch(saveTracks(response.data))
			})
	}
}
const saveTracks = (data) => {
	if (data) {
		return {
			type: actionTypes.SAVE_TRACKS,
			tracks: data.tracks,
			count: data.count,
			currentPage: parseInt(data.currentPage, 10)
		}
	}
}
export const getConnections = (category, subcategory, sort = "topRated", page = 0) => {
	// The sort can either be "topRated", "latest", "mostVoted".
	return dispatch => {
		const url = `/api/browse/getSubcategoryConnections?category=${category}&subcategory=${subcategory}&sort=${sort}&page=${page}`;

		return axios.get(url)
			.then(response => {
				dispatch(saveConnections(response.data));
			})
	}
}
const saveConnections = (data) => {
	return {
		type: actionTypes.SAVE_CONNECTIONS,
		connections: data.connections,
		count: data.count,
		currentPage: parseInt(data.currentPage, 10)
	}
}

// Get the latest connections  
export const getLatest = (currentPage = 0) => {
	return dispatch => {

		const url = "/api/browse/getLatest?page=" + currentPage;
		axios.get(url)
			.then(response => {
				dispatch(saveLatest(response.data));
			})
	}
}
const saveLatest = (data) => {
	return {
		type: actionTypes.SAVE_LATEST,
		connections: data.connections,
		count: data.count,
		currentPage: parseInt(data.currentPage, 10)
	}
}
// get top rated tracks
export const getTopRated = (currentPage = 0) => {
	return dispatch => {
		const url = '/api/browse/getTopRated?page=' + currentPage;
		axios.get(url)
			.then(response => {
				dispatch(saveTopRated(response.data));
			})
			.catch(err => {
				console.log(err);
			})
	}
}
const saveTopRated = (data) => {
	return {
		type: actionTypes.SAVE_TOP_RATED,
		connections: data.connections,
		count: data.count,
		currentPage: parseInt(data.currentPage, 10)
	}
}


// Update Filters
export const updateTrackConFilter  = (value) => {
	return {
		type: actionTypes.UPDATE_TRACK_CON_FILTER,
		value: value
	}
}
export const updateSortFilter = (value) => {
	return {
		type: actionTypes.UPDATE_SORT_FILTER,
		value: value
	}
}







