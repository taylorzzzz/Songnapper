import React, { Component } from 'react';

import * as classes from './CommentSubmission.css';

import ExpandingTextInput from '../../../UI/Input/ExpandingTextInput';

class CommentSubmission extends Component {
	
	render() {
		const user = this.props.user;
		let usernameClassList = [classes.Username];
		let commentSubmission = null;

		// if user is signed in
		if (user) {
			commentSubmission = (
				<div className={classes.PostContainer}> 
					<div className={classes.Avatar}> 
						<img src={user.avatar} alt="U" /> 
					</div>

					<div className={classes.TextContainer}>
						<div className={usernameClassList.join(' ')}> {user.username} </div>

						<ExpandingTextInput
							submitButtonText="Submit"  
							name="comment"
							placeholder="Post a Comment"
							value={this.props.currentInput}
							handleChange={this.props.changeHandler}
							handleSubmit={this.props.submitHandler} />
					</div>

				</div>
			)
		}


		return (
			<div className={classes.CommentSubmission}>
				{commentSubmission}
			</div>	
		)
	}
	


}

export default CommentSubmission;


