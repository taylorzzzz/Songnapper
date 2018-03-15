import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../store/actions';
import * as classes from './SearchPage.css';

import SearchBar from '../../components/UI/SearchBar/SearchBar';
import BrowseConnection from '../../components/Browse/SubCategory/BrowseConnection/BrowseConnection';
import Pagination from '../../components/UI/Pagination/Pagination';

class SearchPage extends Component {

	constructor(props) {
		super(props);

		this.state = {
			searchInput: "",
			searchResults: null,
			submittedSearch: null,
		}
	}

	componentWillReceiveProps = nextProps => {
		const searchString = nextProps.match.params.search;

		if (this.state.searchInput !== searchString) {
			this.setState({
				searchInput: searchString, 
				submittedSearch: searchString});
			this.props.search(searchString);
		}
	}
	updateFromURL = () => {

	}
	componentDidMount = () => {
		const searchString = this.props.match.params.search;

		this.setState({
			searchInput: searchString,
			submittedSearch: searchString
		})
		this.props.search(searchString);
	}
	handleSearchInput = (e) => {
		this.setState({searchInput: e.target.value});
	}
	submitSearch = (e) => {
		e.preventDefault();
		this.setState({submittedSearch: this.state.searchInput});
		this.props.search(this.state.searchInput);
		this.props.history.push('/search/' + this.state.searchInput);
	}
	pageChangeHandler = (page) => {
		this.props.search(this.state.submittedSearch, page);
		window.scroll({top: 0, behavior: 'smooth'});
	}
	

	render() {
		let results;
		if (this.props.searchResults) {
			results = this.props.searchResults.map(r => {
				return <BrowseConnection 
							connection={r}
							key={r._id} />
			})
		}
		const pageCount = this.props.count === 0 ? 0 : Math.floor((this.props.count - 1)/10);
		let message, start, end;
		if (results) {
			start = this.props.currentPage * 10;
			end = start + results.length;
			message = results.length > 0 ? start + 1 + " - " + end : 0;
		}
		

		return (

			<div className={classes.SearchPage}>	

				<SearchBar 
					classes='SearchPage'
					placeholder="Search"
					value={this.state.searchInput}
					changeHandler={this.handleSearchInput}
					clickHandler={this.submitSearch} />
				{
					this.state.submittedSearch
						? <h3 className={classes.Message}>
							Showing <span>{message}</span> of <span>{this.props.count}</span> 
							search results for <span className={classes.SearchString}>{this.state.submittedSearch}</span>
						</h3>
						: null
				}

				{ results }
				<Pagination 
					pages={ pageCount } 
					pageChangeHandler={ this.pageChangeHandler }
					currentPage={ this.props.currentPage } />
			</div>
		)
	}
}

const mapStateToProps = state => {
	return {
		searchResults: state.search.searchResults,
		currentPage: state.search.currentPage,
		count: state.search.totalResultCount,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		search: (string, page) => dispatch(actions.search(string, page)),
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);