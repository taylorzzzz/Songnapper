import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';


import classes from './SubmitPage.css';
import * as actions from '../../store/actions';

import SelectedTracks from '../../components/Submit/SelectedTracks/SelectedTracks';
import SearchTrack from '../../components/Submit/SearchTrack/SearchTrack';
import Types from '../../components/Submit/Types/Types';
import Modal from '../../components/UI/Modal/Modal';
import ExpandingTextInput from '../../components/UI/Input/ExpandingTextInput';
import Pagination from '../../components/UI/Pagination/Pagination';
import Button from '../../components/UI/Button/Button';

class SubmitPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			displayModal: false,			// Modal window displayed upon submission
			currentTrack: 1,				// The track (1 or 2) we are currently selecting for. 
			currentInput: "",				// The current text input in the search box.
			validConnection: false,			// True when both tracks and at least 1 type are selected. Guards submission.
			types: [],						// Array of the selected types
			submissionStatement: "",		// Current submission statement
			statementSet: false,			// Whether or not a submission statement has been entered.
			inExpanded: false,				// If the input box for the submission statement is currently open and editable.
		}
	}
	componentWillReceiveProps(nextProps) {		
		// If props are changing from not successful submission to successful submission ...
		if (nextProps.successfulSubmission && nextProps.successfulSubmission !== this.props.successfulSubmission) {
			// Display the modal (showing successful submission).
			this.setState({displayModal: true});
		} else { 
			// This ensures that after submitting the connection, if the user selects
			// Make Another Connection on the Modal, that the SubmitPage does not re-render with 
			// displayModal set to true, causing the Modal to render, which would 
			// fail. There is likely a much better way to deal with this but for now this works.
			if (this.state.displayModal) this.setState({displayModal: false});
		}
		// If we are coming to this page from another page, say via the back button
		// we need to make sure that the previous state, left over from the last
		// time we were on the SubmitPage does not conflict with the current session.
		// We clear the slate by calling resetState which resets all of the props.
		if (nextProps.location.pathname !== this.props.location.pathname) {
			this.props.resetState();
		}
	}



/* Called when a connection type is selected. Either adds or removes it from types. */
	selectType = (type) => {			
		// Get the current type selections from state ...
		let types = [...this.state.types];		
		// and check if the current selection has already been selected.
		if (types.indexOf(type) !== -1) {
			// If it has, then the click should cause a removal and so we splice it out.
			types.splice(types.indexOf(type), 1);
			// Update the isSet to false if the removed type was the last/only one.
		} else {
			// If the type has not yet been selected, add it to our types array.
			types.push(type); 
		}
		// Set the types state 
		this.setState({types: types});
	}

/* Submission Statement Input Handler */
	handleStatmentChange = (e) => this.setState({submissionStatement: e.target.value});
/* Submission Statement Submit Handler */
	handleStatementSubmit = (e) => this.setState({statementSet: true, inExpanded: true});
/* Clear Submission Statement Handler - called when user clicks Cancel Button. */
	clearStatement = () => this.setState({submissionStatement: "", statementSet: false, inExpanded: true});
/* Edit Submission Statement Handler - called when a user clicks edit on an existing submission statement  */
	editStatement = () => this.setState({statementSet: false, inExpanded: true});

/* Switch Track Selection Handler (1 or 2) */
	handleTrackSwitch = (track) => this.setState({currentTrack: track});		

/* Handle Search Box Input */
	handleSearchChange = (e) => this.setState({currentInput: e.target.value});
/* Handle Search Box Submit */
	handleSearchSubmit = (e) => {
		e.preventDefault();
		this.props.sendSearch(this.state.currentInput);
	}
/* Handle page change on search results */
	handleLoadMore = () => {
		console.log(this.props);
		this.props.sendSearch(this.state.currentInput, this.props.nextURL);
	}
/* Select Track from Search Results to add to Connection */
	handleTrackSelect = (trackNum, track) => {		
		// Call the selectTrack action creator which updates the redux store with the selected track
		this.props.selectTrack(trackNum, track);
		// Then make the other track the current track and reset the currentInput.
		this.setState({currentTrack: this.state.currentTrack % 2 + 1, currentInput: ""});
		// Finally scroll back up to the top of the track selections.
		const domNode = ReactDOM.findDOMNode(this.trackSelections);
		window.scroll({top: domNode.offsetTop, behavior: "smooth"});
	}


/* SubmitConnectionHandler */
	handleConnectionSubmit = () => {	
		// Call the submitConnection action creator, passing the tracks, types and statement.
		this.props.submitConnection(this.props.trackSelections, this.state.types, this.state.submissionStatement);
		// Then reset the local state values.
		this.setState({
			displayModal: false,
			loggedIn: true,
			currentTrack: 1,
			currentInput: "",
			validConnection: false,
			types: [],
			submissionStatement: "",
			statementSet: false,
			inExpanded: false})
	}
	


	render() {
		// Check whether the connection is ready to be submitted. If both 
		// tracks have been selected and at least one type picked.
		const validConnection = this.props.validConnection && this.state.types.length > 0;
		// Set the Successful Submit Modal 
		let modal = this.state.displayModal ? <Modal /> : null;

		return (
			<div className={classes.SubmitPage}>
			{modal}
			{
				this.props.loggedIn 
					? <div>
						{/*
							<div className={classes.HeaderMessage}> 
								<h5>Create a Connection Between Two Similar Sounding Tracks</h5>
							</div>
						*/}
						
							<div className={classes.SubmitButton}>
								<Button 
									type="submit"
									text="Submit Connection"
									clickHandler={this.handleConnectionSubmit}
									disabled={!validConnection}
									classNames={["SubmitConnection"]}>
									Submit Connection
								</Button>
							</div>
													
							

							<div className={classes.SubmitStep}>
								<p className={classes.StepInstructions}>
									<span className={classes.StepNumber}>1.</span>Select the type(s) of connection
								</p>
								<Types 
									typeClicked={this.selectType} 
									currentTypes={this.state.types} />
							</div>

							<div className={classes.SubmitStep}>
								<p className={classes.StepInstructions}>
									<span className={classes.StepNumber}>2.</span>(Optional) Add a short description of the connection i.e. how the two songs sound alike.
								</p>
								{
									// Render the submitted statement if a statement has been submitted. Otherwise render the text inpu box.
									this.state.statementSet
										? (
											<div className={classes.SubmissionStatement}>
												<p>{this.state.submissionStatement}</p>
												<p onClick={this.editStatement}>Click to edit statement</p>
											</div>)
										: (<ExpandingTextInput 
												name="Submission Statement"
												placeholder="Add a submission statement."
												submitButtonText="Add" 
												value={this.state.submissionStatement} 
												expanded={this.state.inExpanded} 
												handleChange={this.handleStatmentChange} 
												handleSubmit={this.handleStatementSubmit}
												clearInput={this.clearStatement} 
												/>)
								}
								
							</div>
							
							<div className={classes.SubmitStep} ref={(input) => {this.trackSelections = input}}>
								<p className={classes.StepInstructions}>
									<span className={classes.StepNumber}>3.</span> Select the two tracks you'd like to submit using the search bar below.
								</p>
								<SelectedTracks 
									trackSelections={this.props.trackSelections}
									currentTrack={this.state.currentTrack}
									switchTrack={this.handleTrackSwitch} />
								{
									this.props.connectionAlreadyExists 
										? <p className={classes.WarningMessage}>
											A connection already exists between these two tracks
										</p>
										: null
								}
							</div>

							<SearchTrack 
								currentTrack={this.state.currentTrack}				// the current track - 1 or 2
								currentInput={this.state.currentInput}				// the current input in the search bar
								// methods
								switchTrack={this.handleTrackSwitch}				// switch between track one and two 
								inputChanged={this.handleSearchChange}				// function called when searchBar input changes
								sendSearch={this.handleSearchSubmit}				// function called when search is submitted
								onSelect={this.handleTrackSelect}					// function called when a track is selected
								/>

							<Pagination 			// Show the load more button if we have a nextURL property
								loadMoreHandler={this.handleLoadMore}
								more = {this.props.nextURL ? true : false}/>
						</div>

					: <Redirect to={{			// If User is not Logged In, redirect them to the login page 
						pathname: '/login',
						search: 'submit-connection'
					}} />
			}
			</div>			
		)
	}
}

const mapStateToProps = state => {
	return {
		successfulSubmission: state.submit.successfulSubmission,		// Set to true upon successful submit
		loggedIn: !state.auth.loggedOut,								// True if user is logged in
		trackSelections: state.submit.trackSelections,					// Array of the two selected tracks
		validConnection: state.submit.validConnection,					// True if connection is ready to be submitted
		nextURL: state.submit.nextURL,									// Holds the url of additional search results
		connectionAlreadyExists: state.submit.connectionAlreadyExists	// If a connection between tracks already submitted
	}
}
const mapDispatchToProps = dispatch => {
	return {
		resetState: () => dispatch(actions.resetState()),		
		selectTrack: (trackNum, track) => dispatch(actions.selectTrack(trackNum, track)),
		submitConnection: (connection, types, statement) => dispatch(actions.submitConnection(connection, types, statement)),
		sendSearch: (string, page) => dispatch(actions.searchForTracks(string, page)),
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(SubmitPage);

