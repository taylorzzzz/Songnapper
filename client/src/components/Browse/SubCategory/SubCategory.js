import React, { Component } from 'react';
import { connect } from 'react-redux';

import classes from './SubCategory.css';
import * as actions from '../../../store/actions';

import BrowseFilters from './BrowseFilters/BrowseFilters';
import BrowseTrack from './BrowseTrack/BrowseTrack';
import BrowseConnection from './BrowseConnection/BrowseConnection';
import Pagination from '../../UI/Pagination/Pagination';

/*
	This Component renders when a subcategory (Rap, 1990s, Bassline etc...) has 
	been selected. It is made up primarily of a list of either tracks 
	or connections (depending on which of the TrackConFilters is selected). These "Browse Results" 
	are paginated so that only 10 tracks/connections are display at a time. Also rendered within this 
	component is a sort filter which is a selection input that allows us to sort the results e.g top rated.
*/

class SubCategory extends Component {

	constructor(props) {
		super(props);
		this.state = {
			sortSelection: "top rated",				// The current sort selector 
			trackConFilter: "connections",			// The current selection of the track/connection selector
			currentPage: 0,							// The current page of results being displayed.
		}
	}
	componentWillMount() {
		const subcat = this.props.match.params.subcat;
		const sortFilter =  this.props.sortFilter || 'top rated';
		let sort = this.getSort(sortFilter);

		const page = 0;
		this.props.updateBrowseSubCat(this.props.category, subcat, sort, page);
	}
	componentWillUpdate(nextProps, nextState) {
		const subcat = this.props.match.params.subcat;

		if (nextProps.subcategory !== subcat) {
			const sortFilter =  this.props.sortFilter;
			let sort = sortFilter === "top rated" 
				? "topRated" 
				: sortFilter === "newest" 
					? "latest" 
					: "releaseDate";
			const page = 0;
			this.props.updateBrowseSubCat(this.props.category, subcat, sort, page);
		}
	}
	componentWillUnmount() {
		this.props.updateBrowseSubCat(this.props.category, null);
	}

	getSort = (sortFilter) => {
		return sortFilter === 'top rated'
			? 'topRated'
			: sortFilter === 'newest'
				? 'latest'
				: 'releaseDate';

	}
	changeSortFilter = (e) => {
		const sortFilter = e.target.value;
		let sort = this.getSort(sortFilter);

		this.props.updateSortFilter(sortFilter);
		this.setState({sortSelection: sortFilter});
		this.props.updateBrowseSubCat(this.props.category, this.props.subcategory, sort)
	}

	changeTrackConFilter = (e) => {
		const value = e.target.value.toLowerCase() + "s";
		this.setState({trackConFilter: value});
	}
	pageChangeHandler = (page) => {
		this.props.updateBrowseSubCat(this.props.category, this.props.subcategory, this.state.sortSelection, page);
		window.scrollTo({top: 0, behavior: 'smooth'});
	}
	render() {
		// Set the number of pages we will need to paginate for
		const pageCount = this.props.count === 0 ? 0 : Math.floor((this.props.count - 1)/10);

		let tracks = null;
		let connections = null;
		if (this.props.tracks) {
			tracks = this.props.tracks.map(track => {
				return (
					<BrowseTrack 
						track={track}
						key={track.spotify_id} />
				)
			})
		}
		if (this.props.connections) {
			connections = this.props.connections.map(c => {
				return (
					<BrowseConnection 
						connection={c}
						key={c._id} />
				)
			})
		}
		return (
			<div className={classes.SubCategory}>
				<div className={classes.Title}>
					{this.props.subcategory}
				</div>
				<BrowseFilters 
					category={this.props.category} 
					changeSortFilter={this.changeSortFilter}
					sortSelection={this.state.sortSelection}
					filterClickHandler={this.changeTrackConFilter} 
					trackConFilter={this.state.trackConFilter} />
				{
					this.state.trackConFilter === 'tracks'
					? tracks
					: connections
				}
				<Pagination 
					pages={pageCount} 
					pageChangeHandler={this.pageChangeHandler}
					currentPage={this.props.currentPage} />
			</div>
		)
	}

}

const mapStateToProps = state => {
	return {
		category: state.browse.currentCategory,
		subcategory: state.browse.currentSubcategory,
		tracks: state.browse.tracks,
		connections: state.browse.connections,
		sortFilter: state.browse.sortFilter,
		trackConFilter: state.browse.trackConFilter,
		// para pagination
		count: state.browse.totalConnectionCount,
		currentPage: state.browse.currentPage
	}
}

const mapDispatchToProps = dispatch => {
	return {
		updateBrowseSubCat: (cat, subcat, sort, page) => dispatch(actions.updateBrowseSubCat(cat, subcat, sort, page)),
		updateSortFilter: (value) => dispatch(actions.updateSortFilter(value)),
		filterClicked: (value) => dispatch(actions.updateTrackConFilter(value))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SubCategory);