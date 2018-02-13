import React from 'react';

import * as classes from './User.css';

import UserInfo from './UserInfo/UserInfo';
import SubmittedConnections from './SubmittedConnections/SubmittedConnections';
import Likes from './Likes/Likes';
import CommentSection from '../Connection/CommentSection/CommentSection';

import UserTabs from './UserTabs/UserTabs';

const user = props => {
	let isUser = false;

	if (props.currentUser) {
		if (props.currentUser._id === props.user._id) {
			isUser = true;
		}
	}
	let tabDisplay = null;
	switch(props.activeTab) {
		case "connections" : 
			tabDisplay =  <SubmittedConnections user={props.user} />;
			break;
		case "likes" : 
			tabDisplay =  <Likes user={props.user} />;
			break;
		case "comments" : 
			tabDisplay = <CommentSection comments={props.user.comments} show />
			break;
		default : tabDisplay = <p>default case</p>
	}
	

	return (
		<div className={classes.User}>
			<UserInfo user={props.user} self={isUser} />
			<UserTabs clicked={props.clicked} activeTab={props.activeTab}/>
			{tabDisplay}	
		</div>
	)
}


export default user;