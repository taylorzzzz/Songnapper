import React from 'react';
import axios from 'axios';

class Login extends React.Component {
	async handleClick() {
		console.log('handleClick');
		
		const response = await axios.get('/auth/google');
		console.log(response);
	}
	render() {
		const containerStyle = {
			'width': '200px',
			'background':'#ccc',
			'margin':'auto',
			'marginTop': '40px',
			'padding':'50px',
			'textAlign': 'center',
		}
		const buttonStyle = {
			'marginTop': '30px',
			'background': 'green',
			'color': 'white',
			'borderRadius': '3px',
			'boxShadow': '0px 3px 3px rgba(0,0,0,.25)',
			'padding': '20px',
			'cursor': 'pointer',

		}


		return (
			<div style={containerStyle}>
				Click to Login or Register
				<button onClick={this.handleClick} style={buttonStyle}>
					Sign in With google
				</button>
			</div>
		)
	}
}
export default Login;