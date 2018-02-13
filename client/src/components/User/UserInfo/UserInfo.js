import React from 'react';
import { withRouter} from 'react-router-dom';

import * as classes from './UserInfo.css';

import Avatar from '../Avatar/Avatar';
import ContentEditable from '../../UI/ContentEditable/ContentEditable';
import Button from '../../UI/Button/Button';

const userInfo = props => {
	// check for bio 
	let username = props.user.username;
	let bio = props.user.bio || "User has not provided a Bio yet.";
	const submissionCount = props.user.submitted_connections.length + " Submissions";
	// if (props.user.submitted_connections.length === 1) { submissionCount[-1] = "" };
	const friendCount = props.user.friends.length + " Friends";
	
	if (props.editable) {
		username = <ContentEditable value={props.user.username} onEdit={props.onEdit} name="username"/>;
		bio = <ContentEditable value={props.user.bio} onEdit={props.onEdit} name="bio"/>
	}
	return (
		<div className={classes.UserInfo}>
			<Avatar 
				user={props.user} 
				editable={props.editable} 
				clicked={props.uploadAvatar} 
				uploaded={props.uploaded}
				avatarSrc={props.avatarSrc || props.user.avatar}/>

			<div className={classes.TextInfo}>
				<div className={classes.Username}>{username}</div>
				<div className={classes.Bio}>{bio}</div>
				<div className={classes.Counts}>
					<div className={classes.SubmissionCount}>{submissionCount}</div>
					<div className={classes.FriendCount}>{friendCount}</div>
				</div>
				{
					props.self 
						? <Button text="Edit" link={`${props.location.pathname}/edit`}>
								Edit
							</Button>
						: null
				}
				{
					props.editable 
						? (
							<div className={classes.Buttons}>
								<Button text="Save" clickHandler={props.onSave} disabled={!props.validUsername}>
									Save
								</Button>
								<Button text="Cancel" clickHandler={props.onCancel}>
									Cancel
								</Button>
							</div>)
						: null
						
				}
				
			</div>
		</div>
	)
}

export default withRouter(userInfo);