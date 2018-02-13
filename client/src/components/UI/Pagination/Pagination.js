import React from 'react';
import propTypes from 'prop-types';

import * as classes from './Pagination.css';

const pagination = props => {
	
	const classList = [classes.PageNumbers];
	if (props.more) classList.push(classes.LoadMore);
	
	let pages = [];
	let more = null;
	if (props.pages > 0) {
		for(let i = 0; i <= props.pages; i++ ) {
			const classList = [classes.PageNumber];
			if (i === props.currentPage) classList.push(classes.CurrentPage);

			pages.push(
				<div 
					className={classList.join(' ')} 
					key={i} 
					onClick={() => props.pageChangeHandler(i)}>
					{i}
				</div>
			)
		}
		if (props.currentPage < props.pages) {
			pages.push(
			<div 
				className={classes.PageNumber + " " + classes.PageIter}
				key='next' 
				onClick={() => props.pageChangeHandler(props.currentPage + 1)}>
				next
			</div>
		)}
		if (props.currentPage > 0) {
			pages.unshift(
				<div 
					className={classes.PageNumber + " " + classes.PageIter} 
					key='prev' 
					onClick={() => props.pageChangeHandler(props.currentPage - 1)}>
					prev
				</div>
			)
		}
	} else if (props.more) {
		// Create a button that when clicked will send call pageChangeHandler with current page + 1
		more = <p 
			onClick={props.loadMoreHandler}
			className={classes.LoadMoreMessage}>Load More Results</p>
	}
	return (
		<div className={classList.join(' ')}>
			{pages}
			{more}
		</div>
	)
}

pagination.propTypes = {
	currentPage: propTypes.number, 		// current page we are on
	pages: propTypes.number,			// total number of pages
	pageChangeHandler: propTypes.func,	// called when page is changed; passed the new page #
	loadMoreHandler: propTypes.func, 	// When more is valid and load more is clicked, this is called
	more: propTypes.bool,				// When this is true, we display a simple load more button rather than pages
}

export default pagination;