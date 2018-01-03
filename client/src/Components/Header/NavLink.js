import React from 'react';
import {Link} from 'react-router-dom';

class NavLink extends React.Component {
	render() {
		return <Link {...this.props} className="navlink" />
	}
}

export default NavLink;