import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../store/actions';
import TrackInfo from '../../components/Track/TrackInfo/TrackInfo';
import Connections from '../../components/Track/Connections/Connections';

class TrackPage extends Component {
	componentWillMount() {
		const id = this.props.match.params.id;
		this.props.getTrack(id);
	}
	componentWillReceiveProps(nextProps, nextState) {
		if (this.props.match.params.id !== nextProps.match.params.id) {
			const id = nextProps.match.params.id;
			this.props.getTrack(id);
		}
	}
	render() {
		return (
			<div>
				<TrackInfo />
				<Connections />
			</div>
		)
	}
}

const mapDispatchToProps = dispatch => {
	return {
		getTrack: (id) => dispatch(actions.getTrack(id)),
	}
}
export default connect(null, mapDispatchToProps)(TrackPage);