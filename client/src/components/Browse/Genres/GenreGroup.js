import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import propTypes from 'prop-types';
import Slider from 'react-slick';

import * as classes from './Genres.css';

import SubCategoryLink from '../SubCategoryLinks/SubCategoryLink/SubCategoryLink';

class GenreGroup extends Component {
	constructor(props) {
		super(props);
		this.state = {
			windowWidth: 0
		}
	}
	componentDidMount() {
		this.updateWindowWidth();
		window.addEventListener('resize', this.updateWindowWidth);
	}
	componentWillUnmount() {
		window.removeEventListener('resize', this.updateWindowWidth);
	}
	updateWindowWidth = () => {
		this.setState({windowWidth: window.innerWidth})
	}



	render() {
		
		let subgenres = [], 		// Holds all of the subgenres e.g europop, teen pop ...
			groupTitle = "", 		// The name or title of the Genre Group
			slider = null,			// Will hold the Slider component/container
			perSlider = 6,			// The number of slides ber slider window
			group = null;			// This will basically hold the content of component

		perSlider = this.state.windowWidth ? parseInt(this.state.windowWidth / 150, 10) : 0;
		const cat = this.props.genreCat;	// The parent genre e.g Pop, Rock etc.
		const genres = this.props.genres;	// The complete list of all of the genres
		
		if (genres) {
			let matchingStrings = [];
			switch (cat) {
				case "All": {
					groupTitle = "Most Popular";
					matchingStrings.push('');
					break;
				}
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

			let subgenreCount = 0;

			subgenres = genres.filter((g,i) => {

				if (subgenreCount > 9) return false;

				let match = false;
				matchingStrings.forEach(str => {

					if (g.value.indexOf(str) > -1) {
						subgenreCount++;
						match = true
					} 
				})
				return match;
			})
			
			const links = subgenres.map((g,i) => {
				// We are wrapping these in divs so that they work with the slider
				return (
					<div key={g.value + i}>
						<SubCategoryLink subcat={g} cat="Genres" />
					</div>
				)
			})
			
			var settings = {
			    dots: false,
			    slidesToShow: perSlider,
				arrows: true,
			    className: classes.Slider,

			};
		    slider = (
		      <Slider {...settings} >
		      	{[...links]}
		      </Slider>);
		   	group = (
		   		<div className={classes.Container}>
			   		<div className={classes.GroupTitle}>{groupTitle}</div>
					{slider}
					{ cat === 'All' ? <Link to="/browse/genres/all">View All</Link> : null}
					
				</div>
		   	)
		}
		return group;
	}

}

GenreGroup.propTypes = {
	genreCat: propTypes.string,		// The parent genre Pop, Rock, HipHop, R&B etc.
	genres: propTypes.array			// An array of all of the genre objects
}

export default GenreGroup;