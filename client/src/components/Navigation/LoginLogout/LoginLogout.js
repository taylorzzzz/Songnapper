import React from 'react'

import classes from './LoginLogout.css';

import Avatar from '../Avatar/Avatar';
import AuthLinks from './AuthLinks/AuthLinks';

const loginLogout = (props) => {
	return (
		<div className={classes.LoginLogout}>
			{ 
				props.user 
					? <Avatar user={props.user} />
					: props.user === ""
						? <AuthLinks horizontal />
						: null
			}
		</div>
	)
}


export default loginLogout;