import React from 'react';
import SearchResultItem from './ResultItem';

class SearchResults extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			searchResults: this.props.searchResults
		}
		this.renderResults = this.renderResults.bind(this);
		this.handleSelection = this.handleSelection.bind(this);
	}
	handleSelection(track) {
		this.props.selectTrack(track);
	}
	renderResults() {
		if (this.state.searchResults.length > 0) {
			var items = this.state.searchResults.map((result,i) => {
				return <SearchResultItem key={i} track={result} selectTrack={this.handleSelection}/>
			})
			return items;
		} else {
			return <li> no search yet</li>
		}
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.searchResults != this.props.searchResults) {
			this.setState({searchResults: nextProps.searchResults});
		}
	}
	render() {
		return (
			<div className="SearchResults">
				<ul>
					{this.renderResults()}
				</ul>
			</div>
		)
	}
}
export default SearchResults;