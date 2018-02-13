import React from 'react';

import * as classes from './SubmittedConnections.css';

import Connection from '../../Browse/SubCategory/BrowseConnection/BrowseConnection';

const submittedConnections = props => {

	const connections = props.user.submitted_connections.map(c => {
		return <Connection connection={c} key={c._id}/>
	})

	return (
		<div className={classes.SubmittedConnections}>
			{connections}
		</div>
	)
}

export default submittedConnections;