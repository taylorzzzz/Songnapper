import React from 'react';
import { connect } from 'react-redux';

import classes from './SearchResults.css';
import SearchResult from './SearchResult/SearchResult';

const searchResults = (props) => {
	let results, message;
	if (props.results) {
		results = props.results.map((result, i) => {
			return <SearchResult 
				track={result} 
				currentTrack={props.currentTrack}
				key={i} 
				onSelect={props.onSelect}/>
		})
		message = results.length === 1 
						? "Found " + results.length + " result"
						: "Found " + results.length + " results"

	}
	return (
		<div className={classes.SearchResults}>
		{
			props.isFetching
				? <div className={classes.SearchMessage}>Fetching tracks...</div>
				: <div className={classes.SearchMessage}>{message}</div>
				
		}
			
			{results}
			
		</div>
	)
}

const mapStateToProps = state => {
	return {
		isFetching: state.submit.isFetchingTracks,
		results: state.submit.searchResults,
	}
}

export default connect(mapStateToProps)(searchResults);