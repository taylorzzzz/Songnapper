import React from 'react';

import * as classes from './Controls.css';
import Comment from './Comment/Comment';
import Vote from './Vote/Vote';

const controls = props => {

	return (
		<div className={classes.Controls}>
			
			<div className={classes.Icons}>
				<Comment connection={props.connection} clicked={props.commentClicked}/>
				<Vote connection={props.connection} user={props.user} up />
				<Vote connection={props.connection} user={props.user} down />
			</div>

		</div>
	)
}

export default controls;