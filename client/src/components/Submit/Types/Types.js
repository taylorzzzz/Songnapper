import React from 'react';

import * as classes from './Types.css';

const types = props => {

	const types = ['Melody','Lyrics','Bassline','Chords', 'Other'];
	let currentTypes = [...props.currentTypes];

	const typeTabs = types.map((t, i) => {
		let cn;
		if (currentTypes.indexOf(t) !== -1) {
			cn = classes.Selected;
			currentTypes.splice(currentTypes.indexOf(t), 1);
		} else { cn = null; }
		return <li 
				id={classes[t]} 
				className={cn}
				onClick={() => props.typeClicked(t)}
				key={t}
				>{t}</li>
	})

	const messageClasses = [classes.TypesMessage];
	if (props.currentTypes.length > 0) messageClasses.push(classes.HiddenMessage);

	return (
		<ul className={classes.Types}>
			{typeTabs}
		</ul>
	)
}

export default types;

