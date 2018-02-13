import React from 'react';
import { Link } from 'react-router-dom';

import * as classes from './Connection.css';

import Track from './Track/Track';
import SubmissionStatement from './SubmissionStatement/SubmissionStatement';
import Types from '../../components/Connection/Types/Types';


const connection = props => {
	let con = null;

	const user = props.submittedBy ? props.submittedBy : null;

	if (props.connection && props.submittedBy) {
		con = (
			<div className={classes.Connection}>

				<div className={classes.TracksContainer}>

					<Track track={props.connection.tracks[0]}/>
					<Track track={props.connection.tracks[1]}/>

					<div className={classes.MetaContainer}>
						<Types types={props.connection ? props.connection.types : null} />
						<div className={classes.SubmittedBy}>
							Submitted By: <Link to={process.env.PUBLIC_URL + '/user/' + user._id}>{user.username}</Link>
						</div>
					</div>

					<SubmissionStatement 
						statement={ props.connection.submission_statement }
						submittedBy={ props.submittedBy } />
					
				</div>


			
			</div>
		)
	}
	return (con)
}


export default connection;