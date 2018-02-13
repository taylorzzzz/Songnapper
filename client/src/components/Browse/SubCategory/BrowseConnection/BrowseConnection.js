import React from 'react';
import { Link } from 'react-router-dom';

import { timeSince } from '../../../../utils/functions';
import * as classes from './BrowseConnection.css';

import Connection from '../../../UI/Connection/Connection';

const browseConnection = (props) => {

	let additionalInfo = null;
	if (props.showPostDate) {
		let posted = timeSince(new Date(props.connection.submitted_on));
		additionalInfo = <div className={classes.Posted}>Posted <span>{posted}</span> ago</div>
	}

	return (
		<Link to={`/connection/${props.connection._id}`} style={{textDecoration: 'none'}}>
			{additionalInfo}
			<Connection connection={props.connection} />
		</Link>
	)	
}

export default browseConnection;