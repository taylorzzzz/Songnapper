import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import classes from './Modal.css';
import * as actions from '../../../store/actions';

const modal = (props) => {
	console.log('Modal.js rendering...')
	console.log(props);
	return (
		<div className={classes.Modal}>
			<h1>Thanks!</h1>
			<h3>Your Connection was successfully submitted</h3>
		
			<div className={classes.Links}>
				<Link to={`/connection/${props.connection._id}`}>
					<div onClick={props.resetState}>Check It Out!</div>
				</Link>
				or...
				<div className={classes.AnotherSubmissionBtn} onClick={props.resetState}>Make Another Submission!</div>
			</div>
		</div>
	)
}

const mapStateToProps = state => {
	return {
		connection: state.submit.submittedConnection
	}
}
const mapDispatchToProps = dispatch => {
	return {
		resetState: () => dispatch(actions.resetState())
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(modal);