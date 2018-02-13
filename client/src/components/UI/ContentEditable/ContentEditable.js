import React, { Component } from 'react';

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
			<span 
				contentEditable="true"
				onInput={ this.handleInput }
				value={this.props.value}
				dangerouslySetInnerHTML={ {__html: this.props.value } }>
			</span>
		)
	}
}

export default ContentEditable;