import React, { Component } from 'react';
import { connect } from 'react-redux';

import classes from './SubCategoryLinks.css';

import SubCategoryLink from './SubCategoryLink/SubCategoryLink';
import Pagination from '../../UI/Pagination/Pagination';

const PER_PAGE = 20;
/*
	Each Category - Genres, Decades, Types - has a number of 
	Subcategories - Rock, 1990s, Lyrics etc. This component displays 
	links to those Subcategories for the current Category.
	In the case of Genres, there are lots of subcategories (different genres)
	and so we want to paginate the results.
*/
class SubCategoryLinks extends Component {

	constructor(props) {
		super(props);

		this.state = {
			currentPage: 0,
		}
	}

	componentWillReceiveProps = (nextProps) => {
		// If user goes from one category to another, we want to reset the 
		// current page to 0.
		if (nextProps.category !== this.props.category) {
			this.setState({currentPage: 0})
		}
	}


	pageChangeHandler = (page) => {
		this.setState({currentPage: page});
		window.scroll({top: 0, behavior: 'smooth'})
	}

	render() {
		let links = 'getting links';
		let pageCount = 0;

		// First we check if the subcategories are loaded yet. 
		// On the first mount, they will take a couple updates since they are fetched from redux in Parent Component.
		if (this.props.subcategories) {
			// Then we need to check if the category is set (not null) and also not still 
			// 'latest' or 'top' which would be the case (at first) when we jump over from 
			// one of those two tabs (since the Parent has not gotten updated Category from redux yet.
			// Wait until the category has updated so that this.props.subcategories[this.props.category] is valid.
			if (this.props.subcategories[this.props.category]) {
				// If the Category is either Genres, Decades or Types then we are ready to render the 
				// Subcategory Links. 
				// Also, we want to limit it to 20 subcategory Links.
				// For Instance, if currentPage is 0 (first page), then we want to display
				// results 0 - 20. If currentPage is 1, then we want to display 20 - 40.

				// Get the Subcategory Links for the current Category
				const currentPageLinks = this.props.subcategories[this.props.category];
				// Get the first link # for that page.
				const countStart = this.state.currentPage * PER_PAGE;
				// Create (at most) 20 subcategory links, starting from countStart.
				links = currentPageLinks.slice(countStart,countStart + 20).map((sub, i) => {
					return <SubCategoryLink key={sub.value + i} subcat={sub} />
				})
				// Determine the number of pages given the number of subcategory links
				pageCount = Math.floor(currentPageLinks.length / PER_PAGE);
			}
			
		}
		return (
			<div className={classes.SubCategoryLinks}>
				{links}
				<Pagination 
					pages={pageCount} 
					pageChangeHandler={this.pageChangeHandler}
					currentPage={this.state.currentPage} />
			</div>
		)	

	}
}

const mapStateToProps = state => {
	return {
		subcategories: state.browse.subcategories,
		fetching: state.browse.isFetching,
		currentPage: state.browse.currentCategoryPage,
	}
}

export default connect(mapStateToProps)(SubCategoryLinks);