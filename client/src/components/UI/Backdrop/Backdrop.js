import React from 'react';
import { connect } from 'react-redux';

import classes from './Backdrop.css';

const backdrop = (props) => (
	props.show ? <div className={classes.Backdrop} onClick={props.clicked}></div> : null
)

const mapStateToProps = state => {
	return {
		show: state.nav.sideDrawerOpen
	}
}

export default connect(mapStateToProps)(backdrop);