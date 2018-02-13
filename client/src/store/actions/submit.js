import axios from 'axios';
import * as actionTypes from './actionTypes';
// import credentials from '../../credentials.json';

export const resetState = () => {
	return {
		type: actionTypes.RESET_STATE
	}
}

export const searchForTracks = (string, loadMoreURL) => {
	// Send search string to back end where a search will be sent to Spotify API
	return (dispatch, getState) => {			
		// While the request is running we will display a message/spinner in SearchResults component
		dispatch(requestingTracks());
		// If this is a load more scenario, then pass the next url as a query
		// let url = `api/submit/searchTracks?track=${string}`;
		let url = 'api/submit/searchTracks';
		let config = {
			method: 'POST',
			url: url,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			data: {
				track: string,
				nextURL: loadMoreURL
			}
		}
		
		return axios.post(config)
			.then(response => {
				// If Spotify search query was successful, save search results and url of next page
				// If we are loading more results (as opposed to doing the initial search via searchbox)
				// then we want to append all of the results to our current array of results rather than
				// overwrite them. To indecate this, we'll pass an append boolean.
				const append = loadMoreURL ? true : false;
				dispatch(saveSearchResults(response.data.tracks, response.data.nextPage, append));
			})
			// What is this for? Don't we already do this on the backend?
			.catch(error => {
				console.log('error', error);
				if (error.response.status === 401) {
					console.log('401 error');
					// dispatch(getAccessToken(trackNum, string));
				}
			})
	}
}
const requestingTracks = () => {
	return {
		type: actionTypes.REQUESTING_TRACKS
	}
}
const saveSearchResults = (tracks, nextURL, append) => {
	// Saves results from the Spotify search after updating them slightly.
	const updatedTracks = tracks.map(t => {
		// Rather than using the track objects returned by spotify, we will pare the fields down
		// to just those we need and make our own track objects.
		let albumCover = null;
		if (t.album.images.length === 1 ) albumCover = t.album.images[0].url;
		else if (t.album.images.length > 1) albumCover = t.album.images[1].url;
		return {
			title: t.name, 
			album: {
				name: t.album.name,
				cover_img: albumCover,
				release_date: t.album.release_date
			},
			artist: {
				name: t.artists[0].name,
				genres: t.artists[0].genres
			},
			connections: t.connections,
			spotify_track: t
		}
	})
	return {
		type: actionTypes.SAVE_SPOTIFY_SEARCH_RESULTS,
		results: updatedTracks,
		nextURL: nextURL,
		append: append
	}
}

// Selecting a track to add to SelectedTracks
export const selectTrack = (trackNum, track) => {
	return {
		type: actionTypes.SELECT_TRACK,
		trackNum: trackNum,
		track: track
	}
}

// Submitting a Connection
export const submitConnection = (trackSelections, types, statement) => {
	return (dispatch, getState) => {
		if (getState().submit.validConnection) {
			dispatch(submittingConnection());
			let url = "api/submit/submitConnection2";
			const options = {
				url: url,
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				data: {
					trackOne: trackSelections[0].spotify_track,
					trackTwo: trackSelections[1].spotify_track,
					types: types,
					statement: statement,
				}
			}
			return axios(options)
				.then(response => {
					dispatch(successfulSubmission(response.data));
				})
				.catch(error => {
					console.log(error);
					dispatch(failedSubmission());
				})
		} else {
			console.log('connectionAlreadyExists');
			dispatch(connectionAlreadyExists());
		}
		
	}
}
const submittingConnection = () => {
	return {
		type: actionTypes.SUBMITTING_CONNECTION
	}
}
const successfulSubmission = (connection) => {
	return {
		type: actionTypes.SUCCESSFUL_SUBMISSION,
		submittedConnection: connection
	}
}
const connectionAlreadyExists = () => {
	return {
		type: actionTypes.CONNECTION_ALREADY_EXISTS
	}
}
const failedSubmission = () => {
	return {
		type: actionTypes.FAILED_SUBMISSION
	}
}
