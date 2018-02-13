import React from 'react';

import classes from './BrowseFilters.css';
import SortFilter from './SortFilter/SortFilter';
import TrackConFilter from './TrackConFilter/TrackConFilter';

const browseFilters = (props) => {
	const classList = [classes.BrowseFilters];
	if (props.category === 'types') classList.push(classes.OneFilter)

	return (
		<div className={classList.join(' ')}>
			{ 
				props.category !== 'types' 
					? <TrackConFilter 
						filterClickHandler={props.filterClickHandler} 
						currentFilter={props.trackConFilter}/> 
					: null }
			<SortFilter 
				changeSortFilter={props.changeSortFilter} 
				currentSelection={props.sortSelection} />
		</div>
	)
}

export default browseFilters;