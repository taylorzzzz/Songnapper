export const validateEmail = email => {
	return email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
}
export const getEmailValidationErrors = email => {
	let errorMessage = [];
	if (!email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
		errorMessage.push("Not a valid Email Adress");
	}
	return errorMessage;
}



export const validatePassword = password => {
	// password must contain at least one digit and be
	// between 6 and 15 characters long
	if (!password.match(/^(?=.*\d).{6,15}$/)) return false
	return true;
}
export const getPasswordValidationErrors = password => {
	let errorMessage = [];
	if (password.length < 6) {
		errorMessage.push("Password must be at least 6 characters. ");
	} 
	else if (password.length > 15) {
		errorMessage.push("Password must be less than 15 characters. ");
	} 
	else if (!password.match(/[0-9]/g)) {
		errorMessage.push("Password must contain at least one number. ");
	}
	return errorMessage;
}



export const validateUsername = username => {
	if (!username.match( /^[A-Za-z0-9_]{3,15}$/)) {
		return false;
	}
	return true;
}
export const getUsernameValidationErrors = username => {
	let errorMessage = [];
	if (username.length < 3) {
		errorMessage.push("Username must be at least 3 characters long. ");
	} 
	else if (username.length > 15) {
		errorMessage.push("Username may not be more than 15 characters long. ");
	}
	// username may only contain uppercase, lowercase, numbers and underscore
	else if (!username.match( /^[A-Za-z0-9_]*$/)) {
		errorMessage.push("Username may only contain upper and lowercase letters, numbers and underscores ( _ )");
	}
	return errorMessage;
}
