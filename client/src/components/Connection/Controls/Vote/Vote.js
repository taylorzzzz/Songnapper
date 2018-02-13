import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import * as classes from './Vote.css';
import * as actions from '../../../../store/actions';

const THUMBS_UP_ICON = "fa fa-thumbs-o-up";
const THUMBS_DOWN_ICON = "fa fa-thumbs-o-down";

class Vote extends Component {

	constructor(props) {
		super(props);

		this.handleVote = this.handleVote.bind(this);
	}

	handleVote() {
		// called when user votes.
		// First we make sure user is signed in at all. If not redirect them to login page
		let swap = false;
		let direction = this.props.up ? "up" : "down";
		const connection = this.props.connection;
		const thisVote = this.props.up 
			? this.props.user.connection_up_votes 
			: this.props.user.connection_down_votes;
		const oppositeVote = this.props.up
			? this.props.user.connection_down_votes
			: this.props.user.connection_up_votes
		
		
		if (this.props.user) {
			// Check if user has already voted on this track in the same manner as they are now
			if (thisVote.indexOf(connection._id) === -1) {
				// If not then we check if they have voted the opposite way 
				if (oppositeVote.indexOf(connection._id) === -1) {
					// If not then send vote with swap set to false;
					this.props.vote(connection, this.props.user, swap, direction);
				} else {
					swap = true;
					this.props.vote(connection, this.props.user, swap, direction);
				}
			} else {
				// If they have then we let them know that they have already voted on this track in this way
				console.log('you already voted on this track');
			}
			
		} else {
			this.props.history.push('/login?connection/' + this.props.connection._id);
		}
		
	}

	render() {
		const connection = this.props.connection;
		const user = this.props.user;
		let count, icon, classList = [classes.Vote];

		if (connection) {
			if (this.props.up) {
				classList.push(classes.UpVote);
				count = connection.up_votes;
				icon = THUMBS_UP_ICON;
				// check if user's current vote matches. If so make bold
				if (user) { 
					if (user.connection_up_votes.indexOf(connection._id) !== -1) {
						classList.push(classes.CurrentVote);
					}
				}	
			} else {
				classList.push(classes.DownVote);
				count = this.props.connection.down_votes;
				icon = THUMBS_DOWN_ICON;

				if (user) { 
					if (user.connection_down_votes.indexOf(connection._id) !== -1) {
						classList.push(classes.CurrentVote);
					}
				}
			}


		}

		
		return (
			<div className={classList.join(' ')}>
				<span> {this.props.connection ? count : null} </span>
				<i className={icon} onClick={this.handleVote}></i>
			</div>
		)
	}
	
}


const mapDispatchToProps = dispatch => {
	return {
		vote: (c, u, s, d) => dispatch(actions.vote(c, u, s, d))
	}
}
export default withRouter( connect(null, mapDispatchToProps)(Vote) );


