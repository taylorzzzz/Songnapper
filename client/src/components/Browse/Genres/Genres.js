import React, {Component} from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';

// import BrowseNav from '../BrowseNav/BrowseNav';
import AllGenres from './AllGenres';
import SubCategory from '../SubCategory/SubCategory';
import GenreGroup from './GenreGroup';

import * as classes from './Genres.css';

class Genres extends Component {

	render() {
		const genres = this.props.subcategories ? this.props.subcategories.genres : null

		return (
			<Switch>
					<Route path="/browse/genres/all" component={AllGenres} />
					<Route path="/browse/genres/:subcat" component={SubCategory} />
					<Route path="/browse/genres" render={() => {
						return (
							<div className={classes.Genres}>
								<GenreGroup genreCat="All" genres={genres}/>
								<GenreGroup genreCat="Pop" genres={genres}/>
								<GenreGroup genreCat="Hip Hop" genres={genres}/>
								<GenreGroup genreCat="Rock" genres={genres}/>
								<GenreGroup genreCat="R&B" genres={genres}/>
							</div>
						)
					}}/>
				</Switch>
		)
	}
}

const mapStateToProps = state => {
	return {
		subcategories: state.browse.subcategories,
		fetching: state.browse.isFetching,

	}
}

export default connect(mapStateToProps)(Genres);