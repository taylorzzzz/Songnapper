import React from 'react';

import * as classes from './Comment.css';

const comment = props => {
	return (
		<div className={classes.Comment} onClick={props.clicked}>
			<span>
				{props.connection ? props.connection.comments.length : null}
			</span>
			<i className="fa fa-comment-o" onClick={this.handleVote}></i>
		</div>
	)
}

export default comment;