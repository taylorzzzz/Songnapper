import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import * as classes from './AboutPage.css';

class AboutPage extends Component {

	render() {
		return (
			<div className={classes.AboutPage}>
				<div className={classes.Header}>
					<h1>About</h1>
					<h4>Songnapper allows you to make connections between songs that sound alike. </h4>

				</div>
			</div>
		)
	}
}

export default AboutPage;

