import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import hero from './hero.png';

import * as classes from './HomePage.css';
import * as actions from '../../store/actions';

import Track from '../../components/Connection/Track/Track';
import Connection from '../../components/UI/Connection/Connection';
import Types from '../../components/Connection/Types/Types';
import GenreGroup from '../../components/Browse/Genres/GenreGroup';
// import SubmissionStatement from '../../components/Connection/SubmissionStatement/SubmissionStatement';


// One thing I need to do here is set the ID of the conneciton 
// I want to feature depending on whether we are in the development 
// environment or in production.

const ID = "5a81223975c295ed618f2870" 	// Shes So Fine / My Sweet Lord

class HomePage extends Component {

	componentDidMount() {
		this.props.getFeatured(ID);
		this.props.getLatest();
		this.props.getAllSubCategories();
	}

	render() {
		let featuredTracks = [], 
			latestConnections = [];
		let statement = "", link = null, genreGroup = null;
		const genres = this.props.subcategories ? this.props.subcategories.genres : null;

		if (this.props.featured && this.props.latest) {
			// Set up Featured Connection
			featuredTracks.push(<Track track={this.props.featured.tracks[1]} key="1" />);
			featuredTracks.push(<Track track={this.props.featured.tracks[0]} key="2"/>);
			statement = this.props.featured.submission_statement;
			// Set up Latest Connections
			latestConnections = this.props.latest.map((c,i) => {
				return (
					<Link to={`/connection/${c._id}`} style={{textDecoration: 'none'}} key={i}>
						<Connection connection={c} />
					</Link>
				)
			})
			link = <Link to="browse/latest" className={classes.ViewMore}>View more</Link>
			genreGroup = (
				<div>
					<GenreGroup genreCat="All" genres={genres} />
					<GenreGroup genreCat="Hip Hop" genres={genres} />
					<GenreGroup genreCat="Rock" genres={genres} />
				</div>
			)
		}


		return (
			<div className={classes.HomePage}>
				<div className={classes.Hero} >
					<div className={classes.Tagline}>
						<h1>Think two songs sound alike?</h1>
						<h3>Create a <span>connection</span> and see what others think</h3>
						<p>Read more about how Songnapper works <i className="fa fa-question-circle"></i></p>
					</div>
					<div className={classes.ImgContainer}>
						<img src={hero} alt=""/>
					</div>
				</div>

				<main className={classes.ContentContainer}>
					<div className={classes.TopRow}>
						<div className={classes.Featured}>
							<h1>Featured Connection</h1>
							<p>{statement}</p>
							<Types types={this.props.featured ? this.props.featured.types : null} />
							{ featuredTracks }						
						</div>

						<div className={classes.Latest}>
							<h1>Latest</h1>
							{latestConnections}
							{link}
						</div>
					</div>
					<div className={classes.RowTwo}>
						<h3>Browse Connections By Genre</h3>
						{genreGroup}
					</div>
				</main>

				<footer>
					<p>I am the footer</p>	
				</footer>

			</div>
		)
	}
}

const mapStateToProps = state => {
	return {
		featured: state.home.featured,
		latest: state.home.latest,
		subcategories: state.browse.subcategories,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		getFeatured: (id) => dispatch(actions.getFeatured(id)),
		getLatest: () => dispatch(actions.getFeaturedLatest()),
		getAllSubCategories: () => dispatch(actions.getSubCatLinks())
	}	
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);

