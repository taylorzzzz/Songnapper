import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import * as actions from '../../store/actions';
import './ConnectionPage.css';

import Header from '../../components/Connection/Header/Header';
import Connection from '../../components/Connection/Connection';
import Controls from '../../components/Connection/Controls/Controls';
import CommentSubmission from '../../components/Connection/CommentSection/CommentSubmission/CommentSubmission';
import CommentSection from '../../components/Connection/CommentSection/CommentSection';

class ConnectionPage extends Component {

	constructor(props) {
		super(props);

		this.state = {
			commentInput: "",			// Current Comment Box Input
			showPostSubmit: false,		// Whether or not the Comment Input Box is currently expanded
		}
	}
/* When Component first mounts, fetch the connection and the comments given id (in url) */
	componentWillMount() {			
		const id = this.props.match.params.id;
		this.props.getConnection(id);
		this.props.getComments(id);
	}

/* Handles input in the comment submission box */
	handleCommentChange = (e) => this.setState({commentInput: e.target.value});
/* Handles submission of comment */
	handleCommentSubmit = (e) => {
		e.preventDefault();
		// Make sure that the comment being submitted is not empty
		if (this.state.commentInput.length > 0) {
			// Dispatch action creator which will update db with submitted comment 
			this.props.submitComment(this.state.commentInput, this.props.connection, this.props.user);
			this.setState({showPostSubmit: false, commentInput: "" });
		}
	}
/* Called when user clicks on the Comment Icon. Scrolls the window down to comments */
	scrollToComments = () => {
		const domNode = ReactDOM.findDOMNode(this.commentSection);
		window.scroll({top: domNode.offsetTop, behavior: "smooth"});
	}

	render() {
		return (

			<div>

				<Header connection={this.props.connection} />
				
				<Controls 
					connection={this.props.connection} 
					user={this.props.user} 
					commentClicked={this.scrollToComments} />

				<Connection 
					connection={this.props.connection} 
					user={this.props.user} 
					submittedBy={this.props.submittedBy} />
				
				
				
				{/* This div is just here so that we can scroll to the comment section */}
				<h3 >Comments</h3>
				<div ref={(input) => {this.commentSection = input}}></div>
				<CommentSection 
					connection={this.props.connection}
					comments={this.props.comments}/>

				<CommentSubmission 
					currentInput={this.state.commentInput}
					user={this.props.user}
					show={this.state.showPostSubmit}
					changeHandler={this.handleCommentChange} 
					submitHandler={this.handleCommentSubmit}/>


			</div>
		)
	}
}

const mapStateToProps = state => {
	return {
		connection: state.con.connection,
		user: state.auth.currentUser,
		submittedBy: state.con.submittedBy,
		comments: state.con.comments,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		getConnection: (id) => dispatch(actions.getConnection(id)),
		getComments: (id) => dispatch(actions.getComments(id)),
		submitComment: (com, con, user) => dispatch(actions.submitComment(com, con, user)),
	}
}


export default connect(mapStateToProps, mapDispatchToProps)(ConnectionPage);


