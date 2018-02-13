import React from 'react';
import { Link } from 'react-router-dom';

import * as classes from './Comment.css';

const comment = props => {

	const comment = props.comment;
	const postDate = new Date(comment.posted_at).toDateString().substr(4);
	const author = comment.author;

	return (
		<div className={classes.Comment}>

			<div className={classes.Content}>
				<div className={classes.Avatar}>
					<img src={author.avatar} alt="avatar" />
				</div>

				<div className={classes.PostInfo}>
					<div className={classes.Author}>
						<Link to={process.env.PUBLIC_URL + '/user/' + author.userID}>
							<span>{author.username}</span>
						</Link>
					</div>

					<div className={classes.PostDate}>
						<span>{postDate}</span>
					</div>
				</div>

				<div className={classes.CommentText}>
					<p>{comment.content}</p>
				</div>
			</div>
			
			
		</div>
	)
}

export default comment;