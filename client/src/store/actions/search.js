import axios from 'axios';
import * as actionTypes from './actionTypes';

export const search = (string, page = 0) => {
	const url = `/api/search?string=${string}&page=${page}`;

	return dispatch => {
		axios.get(url)
			.then(response => {
				const results = response.data.results;
				const count = response.data.count;
				dispatch(saveSearchResults(results, count, page));
			})
			.catch(err => {
				console.log(err);
			})
	}
}

const saveSearchResults = (results, count, page) => {
	return {
		type: actionTypes.SAVE_SEARCH_RESULTS,
		results: results,
		page: page,
		resultCount: count,
	}
}