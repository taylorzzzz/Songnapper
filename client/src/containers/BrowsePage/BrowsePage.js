import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import * as actionCreators from '../../store/actions';

import Breadcrumbs from '../../components/Browse/Breadcrumbs/Breadcrumbs';
import Category from '../../components/Browse/Category/Category';

class BrowsePage extends Component {
	componentWillMount() {
		// Fetches all of the genres, decades and types 
		// and stores them in redux so that they are ready to be displayed 
		// when we need them.
		this.props.getAllSubCategories();
	}

	render() {
		return (
			<div>
				<Breadcrumbs />
				<Switch>
					<Route path={`${this.props.match.url}/decades`} component={Category} />
					<Route path={`${this.props.match.url}/genres`} component={Category} />
					<Route path={`${this.props.match.url}/types`} component={Category} />
					<Route path={`${this.props.match.url}/latest`} component={Category} />
					<Route path={`${this.props.match.url}/top`} component={Category} />
					
					<Redirect to={`${this.props.match.url}/decades`} />
				</Switch>
			</div>
		)
	}
}

const mapDispatchToProps = dispatch => {
	return {
		getAllSubCategories: () => dispatch(actionCreators.getSubCatLinks())
	}
}

export default connect(null, mapDispatchToProps)(BrowsePage);

