import React from 'react';

import Comment from './Comment/Comment';


const commentSection = props => {

	let comments = [];

	if (props.comments) {
		comments = props.comments.map((comment, i) => {
			return <Comment comment={comment} key={i}/>
		})
	}

	return (
		<div>
			{ comments }
		</div>
	)
}

export default commentSection;