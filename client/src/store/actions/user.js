import axios from 'axios';
import * as actionTypes from './actionTypes';

const CLOUDINAIRY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/songnapper/image/upload";
const CLOUDINAIRY_UPLOAD_PRESET = "ydxymbvh";

export const getUser = (id) => {
	// when we visit a user page this function is called
	// if that user is not the same as the current user
	const url = '/api/user/getUserInfo?id=' + id;
	return dispatch => {
		axios.get(url)
			.then(response => {
				if (response.data._id) {
					dispatch(getUser_Success(response.data));
				} else {
					dispatch(getUser_Failed());
				}
				
			})
			.catch(err => {
				console.log('get user failed');
				dispatch(getUser_Failed());
			})
	}
}

const getUser_Success = (user) => {
	return {
		type: actionTypes.GET_USER_SUCCESS,
		user: user
	}
}
const getUser_Failed = () => {
	return {
		type: actionTypes.GET_USER_FAILED
	}
}

export const editUserInfo = (id, username, bio, avatar, avatarChanged) => {

	const url = "/api/user/editUserInfo";
	let data = {
			id: id,
			username: username,
			bio: bio,
			avatar: avatar
		};

	return dispatch => {

		if (avatarChanged) {
			dispatch(uploadingAvatar());
			let formData = new FormData();
			formData.append('file', avatar);
			formData.append('upload_preset', CLOUDINAIRY_UPLOAD_PRESET);
			axios({
				url: CLOUDINAIRY_UPLOAD_URL,
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				data: formData
			})
			.then(response => {
				data.avatar = response.data.secure_url;
				axios.post(url, data)
					.then(user => {
						dispatch(updateCurrentUser(user.data));
						dispatch(getUser(user.data._id))
						dispatch(uploadComplete());
					})
					.catch(err => {
						console.log(err);
					})

			})
			.catch(err => {
				console.log(err);
			})
		} else {
			axios.post(url, data)
					.then(user => {
						return dispatch(updateCurrentUser(user.data));
					})
					.catch(err => {
						console.log(err);
					})
		}		
	}
}

// this method is called to update the user who's page we are on
const uploadingAvatar = () => {
	return {
		type: actionTypes.UPLOADING_AVATAR
	}
}
const uploadComplete = () => {
	return {
		type: actionTypes.UPLOAD_COMPLETE
	}
}
// this method is called to update the currently logged in user
const updateCurrentUser = (user) => {
	return {
		type: actionTypes.SAVE_CURRENT_USER,
		user: user,
	}
}