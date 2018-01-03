import React from 'react';

class Login extends React.Component {
	render() {
		return (
			<form>
				<input type="text" name="username"/>
				<input type="text" name="password"/>
			</form>
		)
	}
}
export default Login;