import React from 'react';
import { Link } from 'react-router-dom';

import * as classes from './Connection.css';

import Track from '../../../Connection/Track/Track';

const connection = props => {
	const track = props.track ? <Track track={props.track} genres year/> : null;

	const types = props.connection 
		? props.connection.types.map((t,i) => {
				let classN = classes[t];
				return <span className={classN} key={i}>{t}</span>
			})
		: null;
	

	return (
		<div className={classes.Connection}>
			<div className={classes.Types}>	
				{types}
			</div>
			{track}

		</div>
	)
}

export default connection;