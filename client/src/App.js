import React, { Component } from 'react';
import { Route, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import './App.css';

import Navigation from './containers/Navigation/Navigation';
import Layout from './hoc/Layout/Layout';
import BrowsePage from './containers/BrowsePage/BrowsePage';
import SubmitPage from './containers/SubmitPage/SubmitPage';
import ConnectionPage from './containers/ConnectionPage/ConnectionPage';
import TrackPage from './containers/TrackPage/TrackPage';
import AuthPage from './containers/AuthPage/AuthPage';
import UserPage from './containers/UserPage/UserPage';
import CreateUsernamePage from './containers/CreateUsernamePage/CreateUsernamePage';
import SearchPage from './containers/SearchPage/SearchPage';

import * as actions from './store/actions';

class App extends Component {

  componentDidMount() {
    // Get currently logged in user - currentUser will then be used for auth throughout site
    this.props.getCurrentUser();
  }
  
  render() {
    return (
      <div>
       	<Navigation user={this.props.currentUser}/>
      	<Layout>
      		<Route path="/browse" component={BrowsePage} />                   
          <Route path="/submit-connection" component={SubmitPage} />
          <Route path="/connection/:id" component={ConnectionPage} />
          <Route path="/track/:id" component={TrackPage} />
          <Route path="/user/:id" component={UserPage} />
          <Route path="/login" component={AuthPage} />
          <Route path="/register" component={AuthPage} />
          <Route path="/create-username" component={CreateUsernamePage} />
          <Route path="/search/:search" component={SearchPage} />
          {
            // If the user is signed in and has not yet created a username ie. just signed up with Social
            // redirect them to the create-username page
            this.props.needsUsername && this.props.currentUser ? <Redirect to="/create-username" /> : null
          }
      	</Layout>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getCurrentUser: () => dispatch(actions.getCurrentUser()),
  }
}
const mapStateToProps = state => {
  return {
    currentUser: state.auth.currentUser,
    needsUsername: state.auth.needsUsername,
  }
}



export default withRouter( connect(mapStateToProps, mapDispatchToProps)(App) );

