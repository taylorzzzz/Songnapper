import defaultAvatar from '../../../assets/images/default_avatar.png';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import propTypes from 'prop-types';

import * as classes from './Avatar.css';
import * as actions from '../../../store/actions';

import Dropdown from '../../UI/Dropdown/Dropdown';
import DropdownItem from '../../UI/Dropdown/DropdownItem/DropdownItem';
import Backdrop from '../../UI/Backdrop/Backdrop2';

class Avatar extends Component {

	constructor (props) {
		super(props);
		this.state = {
			dropdownOpen: false
		}
		this.logout = this.logout.bind(this);
		this.avatarDropDown = this.avatarDropDown.bind(this);
		this.closeDropDown = this.closeDropDown.bind(this);
	}


	logout(e) {
		e.preventDefault();
		this.props.logout();
	}
	avatarDropDown() {
		this.setState({dropdownOpen: !this.state.dropdownOpen});
	}
	closeDropDown() {
		this.setState({dropdownOpen: false});
	}



	render() {
		console.log(this.state);
		const avatarImg = this.props.user.avatar ? this.props.user.avatar : defaultAvatar;

		return (
			<div className={classes.Avatar} >

				<div className={classes.AvatarImage} onClick={this.avatarDropDown}>
					<img src={avatarImg} alt="avatar"/>
				</div>
				{
					this.state.dropdownOpen
						? (
							<div>
								<Backdrop clickHandler={this.closeDropDown} z={1000} />
								<Dropdown open>
									<DropdownItem 
										text={this.props.user.username} 
										link={`/user/${this.props.user._id}`} 
										headItem/>
									<DropdownItem 
										text="Profile" 
										link={`/user/${this.props.user._id}`} 
										icon="fa fa-user" 
										clickHandler={this.closeDropDown} />
									<DropdownItem 
										text="Log Out"
										link="/auth/logout"
										icon="fa fa-sign-out"
										clickHandler={this.logout} />
								</Dropdown>
							</div>
							)
						: null
				}
				
				{
				}				
			</div>
		)
	}
}

Avatar.propTypes = {
	user: propTypes.object,				// The currently logged in user, whom the avatar represents
	 
}
const mapDispatchToProps = dispatch => {
	return {
		logout: () => dispatch(actions.logout())
	}
}

export default connect(null, mapDispatchToProps)(Avatar);