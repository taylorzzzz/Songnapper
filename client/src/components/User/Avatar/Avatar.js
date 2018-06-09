import defaultAvatar from '../../../assets/images/default_avatar.png';

import React from 'react';

import * as classes from './Avatar.css';


const avatar = props => {

	const avatarImg = props.avatarSrc ? props.avatarSrc : defaultAvatar;

	return (

		<div className={classes.Avatar}>

			<img src={avatarImg} alt="avatar"/>

			{

				props.editable 

					? <div className={classes.AvatarPicker}>

						<button onClick={() => props.clicked(this.inputElement)}>

							<span><i className="fa fa-camera"></i></span>

						</button>

						<input 
							type="file" 
							accept=".jpg,.jpeg,.png"
							onChange={props.uploaded}
							ref={input => this.inputElement = input} />

						<div>image preview</div>

						</div>

					: null

			}

		</div>

	)

}

export default avatar;