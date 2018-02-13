import React from 'react';

import * as classes from './SearchTrack.css';

// import SearchBar from './SearchBar/SearchBar';
import SearchResults from './SearchResults/SearchResults';
import SearchBar from '../../UI/SearchBar/SearchBar';

const searchTrack = (props) => {
	return (
		<div className={classes.SearchTrack}>
			<div className={classes.Controls}>
				<div className={classes.TrackSelectors}>
					<span 
						onClick={() => props.switchTrack(1)} 
						className={props.currentTrack === 1 ? classes.Active : null}>Track 1</span>
					<span 
						onClick={() => props.switchTrack(2)}
						className={props.currentTrack === 2 ? classes.Active : null}>Track 2</span>
				</div>

				

			</div>
			
			<SearchBar 
				changeHandler={props.inputChanged}
				value={props.currentInput} 
				clickHandler={props.sendSearch}
				clickHandlerArgs={ [props.currentTrack, props.currentInput] } />

			<SearchResults 
				trackNum={props.trackNum}
				currentTrack={props.currentTrack} 
				onSelect={props.onSelect} />	
		</div>
	)
}

export default searchTrack;