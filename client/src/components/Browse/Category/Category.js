import React, {Component} from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import * as actionTypes from '../../../store/actions';
import * as classes from '../Browse.css';

import SubCategory from '../SubCategory/SubCategory';
import BrowseNav from '../BrowseNav/BrowseNav';
import SubCategoryLinks from '../SubCategoryLinks/SubCategoryLinks.js';
import Latest from '../Latest/Latest';
import TopRated from '../TopRated/TopRated';
import Genres from '../Genres/Genres';

/* 
	This component renderes whenever we are at /browse/:category where 
	category may be either Genres, Decades or Types.
*/
class Category extends Component {

	componentWillMount() {
		// Get the current category from the url 
		const cat = this.props.match.url.split('/')[2];
		// Update Redux store with that category.
		this.props.updateBrowseCat(cat);
	}
	componentWillUpdate(nextProps, nextState) {
		// Checks if category has changed and if so updates category
		const cat = nextProps.match.url.split('/')[2];
		if (nextProps.category !== cat) {
			nextProps.updateBrowseCat(cat);
		}
	}
	

	render() {		

		const currentURL = this.props.match.url;
		const catURL = currentURL.split(this.props.category)[0];

		return (
			<Switch>
				<Route path={`${catURL}latest`} component={Latest} />
				<Route path={`${catURL}top`} component={TopRated} />
				{/* This route will capture browse/genres/pop   browse/genres/all as well*/}
				<Route path={`${catURL}genres`} component={Genres} />
			
				<Route path={`${currentURL}/:subcat`} component={SubCategory} />
				<Route path={`${currentURL}`} render={() => {
					return (
						<div className={classes.BrowseContainer}>
							<BrowseNav />
							<SubCategoryLinks category={this.props.category}/>				
						</div>
					)
				}} />
			</Switch>
		)
	}
}

const mapStateToProps = state => {
	return {
		category: state.browse.currentCategory,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		updateBrowseCat: (category) => dispatch(actionTypes.updateBrowseCategory(category)),
		updateBrowseSubCat: (subcat) => dispatch(actionTypes.updateBrowseSubCat(subcat)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Category);