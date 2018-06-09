import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import classes from './Breadcrumbs.css';


const breadcrumbs = (props) => {
	
	return (

		<div className={classes.Breadcrumbs}>

			<Link to="/browse">

				<div className={classes.Browse}>Browse</div>

			</Link>

			{
				
				props.category 

				? <Link to={`/browse/${props.category}`}><div className={classes.Category}>- {props.category}</div></Link>
				: null

			} 

			{props.subcategory 

				? 	<Link to={`/browse/${props.category}/${props.subcategory}`}>
						<div className={classes.SubCategory}>- {props.subcategory}</div>
					</Link>

				: null

			}

		</div>

	)

}

const mapStateToProps = state => {

	return {

		category: state.browse.currentCategory,
		
		subcategory: state.browse.currentSubcategory

	}

}

export default connect(mapStateToProps)(breadcrumbs);