import React, { Component } from 'react';

import * as classes from './ContentEditable.css';

class ContentEditable extends Component {
	constructor(props) {
		super(props);

		this.handleInput = this.handleInput.bind(this);
	}

	handleInput(e) {
		let html = e.target.innerHTML;
		this.props.onEdit(this.props.name, html);
	}

	render() {
		return (
			<div className={classes.ContentEditable}>
				<span className={classes.Label}>{this.props.label}</span>
				<div className={classes.Container}>
					<span 	
						contentEditable="true"
						onInput={ this.handleInput }
						value={this.props.value}
						dangerouslySetInnerHTML={ {__html: this.props.value } }>
					</span>
				</div>
			</div>
		)
	}
}

export default ContentEditable;