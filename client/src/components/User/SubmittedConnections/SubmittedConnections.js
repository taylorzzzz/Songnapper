import React from 'react';

import Connection from '../../Browse/SubCategory/BrowseConnection/BrowseConnection';

const submittedConnections = props => {

	const connections = props.user.submitted_connections.map(c => {

		return <Connection connection={c} key={c._id}/>

	})

	return (

		<div>

			{connections}

		</div>

	)
	
}

export default submittedConnections;