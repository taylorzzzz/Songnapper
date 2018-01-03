import React from 'react';
import {Link} from 'react-router-dom';
import SearchResults from './SearchResults';
import AddTrack from './AddTrack';
import SubmitConnection from './SubmitConnection';
import './Connection.css';

class AddConnection extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			trackOne: null,
			trackTwo: null
		}
		this.handleSelection = this.handleSelection.bind(this);
	}
	handleSelection(track, trackNum) {
		if (trackNum === 1) {this.setState({trackOne: track})}
		else {this.setState({trackTwo: track})};
	}
	render() {
		return (
			<div className="AddConnection">
				<AddTrack trackNumber={1} selectTrack={this.handleSelection}/>
				<SubmitConnection trackOne={this.state.trackOne} trackTwo={this.state.trackTwo}/>
				<AddTrack trackNumber={2}  selectTrack={this.handleSelection}/>
			</div>
		)
	}
}

export default AddConnection;