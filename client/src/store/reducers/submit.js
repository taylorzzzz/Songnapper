import * as actionTypes from '../actions/actionTypes';

const initialState = {
	searchResults: null,				// Search results from spotify.
	trackSelections: [null, null],
	isFetchingTracks: false,

	submitting: false,

	connectionAlreadyExists: false,
	validConnection: false,

	failedSubmission: false,
	successfulSubmission: false,
	submittedConnection: null,

	nextURL: null,				// After first search, if there > than 20 results, a load more button will display
								// Clicking that button will send a request to backend to get more using this URL.
}

const submitReducer = (state = initialState, action) => {
	switch (action.type) {
		// searching for tracks
		case actionTypes.REQUESTING_TRACKS : {
			return {
				...state, 
				isFetchingTracks: true
			}
		}

		case actionTypes.SAVE_SPOTIFY_SEARCH_RESULTS : {
			// If append is true, append the new results to the old ones.
			let updatedResults = [];
			if (action.append) updatedResults = [...state.searchResults];
			updatedResults = updatedResults.concat(action.results);

			return {
				...state,
				searchResults: updatedResults,
				nextURL: action.nextURL,
				isFetchingTracks: false
			}
		}

		// selecting track
		case actionTypes.SELECT_TRACK : {
			let updatedTrackSelections = [...state.trackSelections];
			updatedTrackSelections[action.trackNum-1] = action.track
			
			let otherTrack = action.trackNum % 2;
			let alreadyExists = false;
			let validConnection = false;

			// check if both tracks are selected
			if (updatedTrackSelections[0] && updatedTrackSelections[1]) {
				validConnection = true;
				// check if both tracks have existing connections
				if (updatedTrackSelections[0].connections.length > 0 && 
					updatedTrackSelections[1].connections.length > 0) {
					// check if any of the selected track's connections match the other track
					action.track.connections.forEach(c => {

						// For each connection...
						// Check if the first tracks's spotify id is equal to the spotify id of 
						// the "other selected track" and if not check for the second track
						if (c.tracks[0].spotify_id === updatedTrackSelections[otherTrack].spotify_track.id) {
							alreadyExists = true;
							validConnection = false;
							console.log('connection alreadyExists')
						} else if (c.tracks[1].spotify_id === updatedTrackSelections[otherTrack].spotify_track.id){
							alreadyExists = true;
							validConnection = false;
							console.log('connection alreadyExists');
						}
					})
				}
				
			}
			return {
				...state,
				trackSelections: updatedTrackSelections,
				connectionAlreadyExists: alreadyExists,
				validConnection: validConnection
			}
		}
		
		// submitting connection
		case actionTypes.SUBMITTING_CONNECTION : {
			return {
				...state,
				submitting: true,
			}
		}
		case actionTypes.SUCCESSFUL_SUBMISSION : {
			return {
				...state,
				submittedConnection: action.submittedConnection,
				submitting: false,
				successfulSubmission: true,
				searchResults: null,
				trackSelections: [null, null],
				validConnection: false,
			}
		}
		case actionTypes.CONNECTION_ALREADY_EXISTS : {
			return {
				...state
			}
		}
		case actionTypes.FAILED_SUBMISSION : {
			return {
				...state,
				failedSubmission: true
			}
		}
		case actionTypes.UPDATE_CONNECTIONS : {
			let updatedTracks = {...state.trackSelections};
			updatedTracks[action.trackNum].connections = action.connections;
			return {
				...state,
				trackSelections: updatedTracks
			}
		}


		// resetting state
		case actionTypes.RESET_STATE : {
			return {
				...state,
				searchResults: null,
				trackSelections: [null, null],
				isFetchingTracks: false,
				submitting: false,
				connectionAlreadyExists: false,
				validConnection: false,
				failedSubmission: false,
				successfulSubmission: false,
				submittedConnection: null,
				connectionType: null,
				nextURL: null,
			}
		}
		default : return state
	}
}

export default submitReducer;