import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import classes from './SubCategoryLink.css';

const subCategoryLink = (props) => {

	let value = props.subcat.value;
	// font size
	let fontSize = classes.LargeFont;
	if (value.length > 8) fontSize = classes.NormalFont;
	if (value.length > 15) fontSize = classes.SmallFont;
	
	return (
		<div className={classes.SubCategoryLink}>
			<Link to={`/browse/${props.category}/${value}`}>
				<div className={classes.LinkImage}>
					<img src={props.subcat.image} alt={value}/>
					<div className={classes.LinkCaption + " " + fontSize}>{value}</div>
				</div>
			</Link>
		</div>
	)
}

const mapStateToProps = state => {
	return {
		category: state.browse.currentCategory,
	}
}
export default connect(mapStateToProps)(subCategoryLink);