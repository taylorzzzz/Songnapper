import React from 'react';
import { Link } from 'react-router-dom';
import propTypes from 'prop-types';

import * as classes from './Types.css';

const types = (props) => {
	let types = null
	if (props.types) {
		types = props.types.map(t => {
			return (
			<div id={classes[t]} key={t} className={classes.Type}>
				<Link to={`/browse/types/${t}`}>
					{t}
				</Link>
			</div>
			)
		});
	}

	return (
		<div className={classes.Types}>
			{types}
		</div>
	)
}
types.propTypes = {
	types: propTypes.array,		// An array of type strings 
}
export default types;