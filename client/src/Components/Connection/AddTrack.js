import React from 'react';
import SearchResults from './SearchResults';

class AddTrack extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			artist: "",
			track: "",
			searchResults: [],
			selection: null
		}
		this.handleSearch = this.handleSearch.bind(this);
		this.handleSelection = this.handleSelection.bind(this);
	}
	handleSearch(e) {
		e.preventDefault();
		let url = "api/tracks?artist=" + this.state.artist + "&track=" + this.state.track;
		fetch(url)
		.then((response) => {
			console.log(response);
			return response.json()})
		.then((json) => {
			if (json.tracks) {
				this.setState({searchResults: json.tracks.items});
			} else {
				console.log('no results returned');
			}
		});
	}
	handleChange(field, e) {
		if (field === "artist") {
			this.setState({artist: e.target.value});
		}
		else {
			this.setState({"track": e.target.value})
		};
	}
	handleSelection(track) {
		this.setState({selection: track});
		this.props.selectTrack(track, this.props.trackNumber);
	}
	render () {
		return (
			<div className="AddTrack">	
				<div className="addTrack-title">
					Add Track {this.props.trackNumber}
				</div>
				<div className="addTrack-container">
					<p>Enter the artist and track name and we'll try to find the song you're looking for</p>
					<form onSubmit={this.handleSearch}>
						<label htmlFor="artist-input">Artist</label>
						<input type="text" name="artist-input" onChange={this.handleChange.bind(this, "artist")} />
						<label htmlFor="track-input">Track</label>
						<input type="text" name="track-input" onChange={this.handleChange.bind(this, "track")}/>
						<input type="submit" value="Search" onSubmit={this.handleSearch}/>
					</form>
					<SearchResults searchResults={this.state.searchResults} selectTrack={this.handleSelection}/>
				</div>			
			</div>
		)
	}
}

export default AddTrack;