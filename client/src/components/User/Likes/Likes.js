import React from 'react';


import Connection from '../../Browse/SubCategory/BrowseConnection/BrowseConnection';


const likes = props => {

	const likes = props.user.connection_up_votes.map(c => {

		return <Connection connection={c} key={c._id}/>

	})

	return (

		<div>

			{likes}

		</div>

	)
	
}

export default likes;