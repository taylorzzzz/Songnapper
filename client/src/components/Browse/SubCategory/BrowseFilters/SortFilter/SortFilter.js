import React from 'react';
import { connect } from 'react-redux';

import * as actions from '../../../../../store/actions';

const sortFilter = (props) => {
	let select = null;
	if (props.trackConFilter === 'tracks') {
		select = (
			<select onChange={(event) => props.updateSortFilter(event.target.value)}>
				<option value="most connected">Most Connected</option>
				<option value="newest">Newest</option>
				<option value="release date">Release Date</option>
			</select>
		)
	} else {
		select = (
			<select onChange={props.changeSortFilter} value={props.currentSelection}>
				<option value="top rated">Top Rated</option>
				<option value="newest">Newest</option>
				<option value="release date">Release Date</option>
			</select>
			)
	}
	
	return (
			<div>
				{select}
			</div>
		)
}

const mapStateToProps = state => {
	return {
		trackConFilter: state.browse.trackConFilter
	}
}

const mapDispatchToProps = dispatch => {
	return {
		updateSortFilter: (value) => dispatch(actions.updateSortFilter(value))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(sortFilter);


