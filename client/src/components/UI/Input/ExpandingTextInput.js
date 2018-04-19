import React, { Component } from 'react';
import propTypes from 'prop-types';

import * as classes from './Input.css';

import Button from '../Button/Button';

class ExpandingTextInput extends Component {

	constructor(props) {
		super(props);
		this.state = {
			expanded: this.props.expanded
		}
		this.toggleOverlay = this.toggleOverlay.bind(this);
		this.submitHandler = this.submitHandler.bind(this);
	}

	toggleOverlay(e) {
		if (!this.state.expanded) this.textInput.focus();  		// set focus (so user doesn't need to click twice) when expanding
		if (e.target.value === 'Cancel' && this.props.clearInput) {
			this.props.clearInput();
		}
		this.setState({expanded: !this.state.expanded});
	}

	submitHandler(e) {
		if (this.props.handleSubmit && this.props.value.length > 0) {
			this.props.handleSubmit(e);
		}
		this.toggleOverlay(e);
	}

	render() {
		
		const classList = [classes.ExpandingTextInput];

		if (this.state.expanded) { 
			classList.push(classes.Expanded) 
		} else { 
			classList.push(classes.Compressed) 
		};

		const compressedOverlay = !this.state.expanded
				? 	<div className={classes.CompressedOverlay} onClick={this.toggleOverlay}></div>
				: 	<div>
						<Button text={this.props.submitButtonText} clickHandler={this.submitHandler} submit>
							{this.props.submitButtonText}
						</Button>
						<Button text="Cancel" clickHandler={this.toggleOverlay} cancel>
							Cancel
						</Button>
					</div>



		return (
			<div className={classes.Input}>

				<textarea 
					name={this.props.name} 
					onChange={this.props.handleChange} 
					className={classList.join(' ')}
					placeholder={this.props.placeholder}
					value={this.props.value}
					ref={(input) => { this.textInput = input; }}>
				</textarea>

				{compressedOverlay}	

			</div>
		)
	}
}

ExpandingTextInput.propTypes = {
	// Values
	name: propTypes.string,					// a name that can be used to refer to the box
	value: propTypes.string,				// value of the text inside the box
	expanded:propTypes.bool,				// whether or not the text box is in the expanded position
	submitButtonText: propTypes.string,		// text for the submit button.
	setFocus: propTypes.bool, 				// if true the focus is automatically set for the 
	// Functions
	toggleExpanded: propTypes.func,			// handler for when the user toggles box expansion
	handleChange: propTypes.func,			// text input handler
	handleSubmit: propTypes.func, 			// text submission handler
	clearInput: propTypes.func,				// function to clear current input (which will often meaning clearing state in parent)
}

export default ExpandingTextInput;

