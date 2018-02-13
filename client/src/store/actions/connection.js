import axios from 'axios';
import * as actionTypes from './actionTypes';


export const getConnection = (id) => {
	const url = '/api/connection/getConnection?id=' + id;
	return (dispatch) => {
		return axios.get(url)
			.then(response => {
				const connection = response.data[0];
				const user = response.data[1];
				dispatch(saveConnection(connection));
				dispatch(saveSubmittedBy(user));
			})
			.catch(err => {
				console.log(err)
			})
	}
}
const saveConnection = connection => {
	return {
		type: actionTypes.SAVE_CONNECTION,
		connection: connection
	}
}
const saveSubmittedBy = user => {
	return {
		type: actionTypes.SUBMITTED_BY,
		user: user,
	}
}

export const vote = (con, user, swap, direction) => {
	return (dispatch) => {

		const dir = direction;  	// either "up" or "down"

		const upVote = dir === "up" ? true : false;
		const data = {
			connection: con,
			userID: user._id,
			swap: swap,
			upVote: upVote
		}
		const postURL = '/api/connection/vote';
		axios.post(postURL, data)
			.then(response => {
				dispatch(vote_success(response.data.connection, response.data.user));
			})
			.catch(err => {
				console.log('err');
			})
	}
}
const vote_success = (connection, user) => {
	// we have a action receiver for VOTE_SUCCESS in both
	// the userReducer - to update the user and
	// the connectionReducer - to update the connection
	return {
		type: actionTypes.VOTE_SUCCESS,
		connection: connection,
		user: user
	}
}

export const submitComment = (comment, connection, user) => {
	const url = '/api/connection/submitComment';
	const data = {
		comment: comment,
		connection: connection._id,
		user: user
	}
	return (dispatch) => {
		return axios.post(url, data)
			.then(response => {
				const updatedConnection = response.data;
				dispatch(submitComment_success(updatedConnection));
				dispatch(getComments(updatedConnection._id));
			})
			.catch(err => {
				console.log(err)
			})
	}
}

const submitComment_success = (connection) => {
	return {
		type: actionTypes.SUBMIT_COMMENT_SUCCESS,
		connection: connection
	}
}

export const getComments = (connection) => {
	const url = '/api/connection/getComments';
	const data = {
		connection: connection
	}
	return (dispatch) => {
		return axios.post(url, data)
			.then(response => {
				dispatch(saveComments(response.data));
			})
			.catch(err => {
				console.log(err)
			})
	}
}
const saveComments = (comments) => {
	return {
		type: actionTypes.SAVE_COMMENTS,
		comments: comments
	}
}