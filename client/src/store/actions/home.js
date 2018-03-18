import axios from 'axios';
import * as actionTypes from './actionTypes';

export const getFeatured = (id) => {
	const url = '/api/home/getFeatured?id=' + id;
	console.log(url);
	return (dispatch) => {
		axios.get(url)
			.then(response => {
				dispatch(saveFeatured(response.data));
			})
			.catch(err => {
				console.log(err)
			})
	}
}

const saveFeatured = connection => {
	return {
		type: actionTypes.SAVE_FEATURED,
		connection: connection
	}
}

export const getFeaturedLatest = () => {
	const url = '/api/home/getLatest';
	return (dispatch) => {
		axios.get(url) 
			.then(response => {
				dispatch(saveLatest(response.data));
			})
	}
}

const saveLatest = (connections) => {
	return {
		type: actionTypes. SAVE_FEATURED_LATEST,
		connections: connections
	}
}