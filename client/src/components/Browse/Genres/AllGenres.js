import React from 'react';

import BrowseNav from '../BrowseNav/BrowseNav';
import SubCategoryLinks from '../SubCategoryLinks/SubCategoryLinks.js';

import * as classes from './Genres.css';

const allGenres = props => {
	return (
		<div className={classes.BrowseContainer}>
			<SubCategoryLinks category='genres'/>				
		</div>
	)
}

export default allGenres;