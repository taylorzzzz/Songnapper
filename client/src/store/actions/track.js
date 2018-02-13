import axios from 'axios';
import * as actionTypes from './actionTypes';

export const getTrack = (id) => {
	const url = '/api/track/getTrack?id=' + id;
	return (dispatch) => {
		return axios.get(url)
			.then(response => {
				dispatch(saveTrack(response.data));
			})
			.catch(err => {
				console.log(err)
			})
	}
}

const saveTrack = (track) => {
	return {
		type: actionTypes.GET_TRACK,
		track: track,
	}
}