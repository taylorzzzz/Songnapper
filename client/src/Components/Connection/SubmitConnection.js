import React from 'react';

class SubmitConnection extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			trackOne: null,
			trackTwo: null,
			successfulSubmission: null
		}
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	componentWillReceiveProps(nextProps) {
		this.setState(nextProps);
	}
	renderTrackOne() {
		if (this.state.trackOne) {
			console.log(this.state);
			return (
				<div className="track-submission trackOne">
					<img src={this.state.trackOne.album.images[0].url} />
					<div className="track-info">
						<div className="trackName">{this.state.trackOne.name}</div>
						<div className="artist-album-container">
							<div className="artistName">{this.state.trackOne.artists[0].name}</div>
							<div className="albumName">{this.state.trackOne.album.name}</div>
						</div>
					</div>
				</div>
			)
		} else {
			return (
				<div className="empty-selection">
					<div className="empty-message">
						Track One empty
					</div>
				</div>
			)
		}
	}
	renderTrackTwo() {
		if (this.state.trackTwo) {
			console.log(this.state);
			return (
				<div className="track-submission trackTwo">
					<img src={this.state.trackTwo.album.images[0].url} />
					<div className="track-info">
						<div className="trackName">{this.state.trackTwo.name}</div>
						<div className="artist-album-container">
							<div className="artistName">{this.state.trackTwo.artists[0].name}</div>
							<div className="albumName">{this.state.trackTwo.album.name}</div>
						</div>
					</div>
				</div>
			)
		} else {
			return (
				<div className="empty-selection">
					<div className="empty-message">
						Track Two empty
					</div>
				</div>
			)
		}
	}
	renderHeader() {
		if (this.state.successfulSubmission) {
			// 
			return (
				<div className="successful-submission">
					submission successful
				</div>
			)
		}
	}
	handleSubmit() {
		if (this.state.trackOne && this.state.trackTwo) {
			var myInit = {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(this.state)
			}
			fetch('api/submitConnection', myInit)
				.then((result) => {
					console.log('result: ');
					console.log(result); 
					return result.json()}) 
				.then((json) => {
					
					if (json.message) {
						// here we need to handle instances where an already existing track is sent back
						console.log(json.message)
					} else {
						this.setState({
							trackOne: null,
							trackTwo: null,
							successfulSubmission: 'placeholder'
						}, () => {
							console.log(this.state);
						})
					}
				})
		} else {
			console.log('please enter two tracks');
		}
	}
	render() {
		return (
			<div className="SubmitConnection">
				{this.renderHeader()}
				{this.renderTrackOne()}
				<button className="submitButton" onClick={this.handleSubmit}>Submit Connection</button>
				<div className="submitMessage"></div>
				{this.renderTrackTwo()}
			</div>
		)
	}
}
export default SubmitConnection;