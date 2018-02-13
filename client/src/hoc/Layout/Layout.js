import React, { Component } from 'react';

import Aux from '../../hoc/Aux/Aux';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

class Layout extends Component {
	render() {
		return (
			<Aux>
				<SideDrawer />
				<main>
					{this.props.children}
				</main>

			</Aux>
		)
	}
}

export default Layout;