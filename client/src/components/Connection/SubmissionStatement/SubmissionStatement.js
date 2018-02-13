import React from 'react';
import propTypes from 'prop-types';

import * as classes from './SubmissionStatement.css';

const submissionStatement = (props) => {

	
	const statement = props.statement
		? (
			<div className={classes.SubmissionStatement}>
				<h3>Submission Statement</h3>
				<p>{props.statement}</p>
			</div>
		)
		: null;

	return statement;
			
}

submissionStatement.propTypes = {
	statement: propTypes.string,			// The statement string
	submittedBy: propTypes.object,			// The user who submitted the connection (and thus the statement)
}
export default submissionStatement