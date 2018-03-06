import React from 'react';
import propTypes from 'prop-types';

import * as classes from './Genres.css';

import SubCategoryLink from '../SubCategoryLinks/SubCategoryLink/SubCategoryLink';

const genreGroup = props => {
	let group = null, subgenres = [], groupTitle = "";
	const cat = props.genreCat;
	const genres = props.genres;
	
	if (genres) {
		// Once both genre category and the list of genres has been passed down
		// we can begin. First we create an array of matching strings based on the category 
		// passed down. So if Hip Hop was the category then the strings we will
		// be matching for will be 'rap' and 'hip hop'
		let matchingStrings = [];
		switch (cat) {
			case "Pop": {
				groupTitle = "Pop";
				matchingStrings.push('pop');
				break;
			}
			case "Rock": {
				groupTitle = "Rock";
				matchingStrings.push('rock');
				break;
			}
			case "Hip Hop": {
				groupTitle = "Hip Hop";
				matchingStrings.push('rap', 'hip hop');
				break;
			}
			case "R&B": {
				groupTitle = "R&B, Soul and Funk";
				matchingStrings.push('r&b', 'funk', 'soul', 'disco');
				break;
			}
			default: break;
		}
		// Next we will go through each genre and map over those that match one 
		// of the matching strings. We will also keep track of the # of subgenres 
		// so that no more than 10 are added.
		let subgenreCount = 0;
		// Start by filtering out the subgenres...
		subgenres = genres.filter((g,i) => {
			// Automatically return false if subgenres is already full
			if (subgenreCount > 9) return false;
			// Otherwise, go through each matchingString...
			let match = false;
			matchingStrings.forEach(str => {
				// and if the subgenre (g) matches that matching string
				// map over a Subcategory link for that subgenre
				if (g.value.indexOf(str) > -1) {
					subgenreCount++;
					match = true
				} 
			})
			return match;
		})
		// Once we have filtered out the subgenres, we want to map all of these 
		// subgenres to SubCategoryLinks, one per subgenre
		const links = subgenres.map((g,i) => {
			return <SubCategoryLink key={g.value + i} subcat={g} />
		})
		// Finally we want to place our Subcategory Links inside of the container
		// But there is one more thing. In some cases, we will have more links then 
		// can fit on one line. Rather than wrapping these link, we want to use a carousel 
		// type feature where the user can go through all of the links by clicking arrows 
		// on the left and right.
		group = (
			<div className={classes.GenreGroup}>
				<div className={classes.GroupTitle}>{groupTitle}</div>
				<div className={classes.LinkContainer}>
					{links}
				</div>
			</div>
		)
	}
	return group;
}

genreGroup.propTypes = {
	genreCat: propTypes.string,		// The parent genre Pop, Rock, HipHop, R&B etc.
	genres: propTypes.array			// An array of all of the genre objects
}

export default genreGroup;