import React from 'react';

import * as classes from './SubmissionStatement.css';

import TextInput from '../../UI/Input/TextInput';

const submissionStatement = props => {
	const classList = [classes.InputContainer];

	return (
		<div className={classes.SubmissionStatement}>
			<div className={classList.join(' ')}>
				<input 
					type="text" 
					name="SubmissionStatement" 
					onChange={(e) => props.changed(e)} 
					value={props.currentStatement} />
			</div>
		</div>
	)
}

export default submissionStatement;