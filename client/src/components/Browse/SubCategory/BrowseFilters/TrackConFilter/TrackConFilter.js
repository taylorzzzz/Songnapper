import React from 'react';

import Button from '../../../../UI/Button/Button';

const trackConFilter = (props) => {
	let trackActive = props.currentFilter === "tracks" ? true : false;
	let connectionActive = props.currentFilter === "connections" ? true : false;


	return (
		<div>
			<Button 
				text="Track" 
				clickHandler={props.filterClickHandler} 
				active={trackActive}
				inactive={!trackActive}>
				Track
			</Button>
			<Button 
				text="Connection" 
				clickHandler={props.filterClickHandler} 
				active={connectionActive}
				inactive={!connectionActive}>
				Connection
			</Button>
		</div>
	)
}

export default trackConFilter;