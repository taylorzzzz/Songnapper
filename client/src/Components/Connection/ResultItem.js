import React from 'react';

class SearchResultItem extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			track: this.props.track
		}
		this.handleClick = this.handleClick.bind(this);
	}
	handleClick() {
		this.props.selectTrack(this.state.track);
	}
	componentWillReceiveProps(nextProps) {
		this.setState({track: nextProps.track});
	}
	render() {
		return (
			<li>
				<div className="SearchResultItem" onClick={this.handleClick}>
					<img src={this.state.track.album.images[0].url} />
					<div className="track-info">
						<div className="trackName">{this.state.track.name}</div>
						<div className="artist-album-container">
							<div className="artistName">{this.state.track.artists[0].name}</div>
							<div className="albumName">{this.state.track.album.name}</div>
						</div>
					</div>
				</div>
			</li>
		)
	}
}

export default SearchResultItem;