import React from 'react';
// import { connect } from 'react-redux';

import classes from './SelectedTrack.css';

import Track from '../../../UI/Track/Track';
// import * as actions from '../../../../store/actions';


const selectedTrack = props => {
	let classList = [classes.PlaceholderCover];

	if (props.currentTrack) classList.push(classes.CurrentTrack);

	const placeholder = (
		<div className={classes.Placeholder}>
			<div className={classList.join(' ')} onClick={() => props.switchTrack(props.trackNum)}></div>
			<div className={classes.PlaceholderText}>
				<p>Track {props.trackNum} not selected yet.</p>
			</div>
		</div>
	)

	return (
		<div className={classes.SelectedTrack}>
			{
				props.track 
					? <Track 
						track={props.track} 
						coverOutline={props.currentTrack} 
						albumClick={props.switchTrack}
						trackNum={props.trackNum}/>
					: placeholder
			}		
		</div>
	)
}

export default selectedTrack;

