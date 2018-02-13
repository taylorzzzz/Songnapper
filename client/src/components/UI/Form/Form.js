import { React, Component } from 'react';
import propTypes from 'prop-types';

import FormElement from './FormElement';

class Form extends Component {
	constructor(props) {
		super(props);

	}

	handleChange(e) {
		console.log('handleChange');
		console.log(e.target.value);
	}

	render() {
		return (
			<form>
				<FormElement 
					title="Form Element" 
					changeHandler={this.handleChange} 
					isValid={this.state.passwordValid} 
					errorMessage="Form Element is not valid" />
			</form>
		)
	}
}

Form.propTypes = {
	
}

export default Form;