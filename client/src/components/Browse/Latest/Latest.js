import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as classes from '../Browse.css';
import * as actions from '../../../store/actions';

import BrowseConnection from '../SubCategory/BrowseConnection/BrowseConnection';
import Pagination from '../../UI/Pagination/Pagination';


class Latest extends Component {
	constructor(props) {
		super(props);

		this.pageChangeHandler = this.pageChangeHandler.bind(this);
	}
	componentWillMount() {
		this.props.getLatest();
	}

	pageChangeHandler(page) {
		
		this.props.getLatest(page);
		window.scrollTo({top: 0, behavior: 'smooth'});
	}
	render() {
		const pageCount = Math.floor(this.props.count/10);

		let connections = null;


		if (this.props.connections) {
			connections = this.props.connections.map((c,i) => {
				return (
					<BrowseConnection 
						connection={c}
						showPostDate
						key={i} />
				)
			})
		}


		return (
			<div className={classes.Latest}>
				<div className={classes.Title}>
					Latest
				</div>
				{connections}
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
		connections: state.browse.connections,
		count: state.browse.totalConnectionCount,
		currentPage: state.browse.currentPage
	}
}
const mapDispatchToProps = dispatch => {
	return {
		getLatest: (page) => dispatch(actions.getLatest(page))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Latest);