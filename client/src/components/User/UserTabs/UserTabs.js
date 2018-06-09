import React from 'react';

import classes from './UserTabs.css';


const userTabs = props => {

	let connectionsClasses = [classes.UserTab],
		commentsClasses = [classes.UserTab],
		likesClasses = [classes.UserTab];

	switch(props.activeTab) {

		case "connections" : connectionsClasses.push(classes.ActiveTab); break;

		case "comments" : commentsClasses.push(classes.ActiveTab); break;

		case "likes" : likesClasses.push(classes.ActiveTab); break;

		default : return null

	}

	return (

		<div className={classes.UserTabs}>	

			<div 
				className={ connectionsClasses.join(' ') }
				onClick={() => props.clicked('connections')}>

					Submitted Connections
			</div>

			<div 
				className={ commentsClasses.join(' ') } 
				onClick={() => props.clicked('comments')}>

					Comments
					
			</div>

			<div 
				className={ likesClasses.join(' ') } 
				onClick={() => props.clicked('likes')}>
				
				Likes
				
			</div>

		</div>

	)
	
}

export default userTabs;