import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';

import './index.css';
import App from './App';

import browseReducer from './store/reducers/browse';
import submitReducer from './store/reducers/submit';
import connectionReducer from './store/reducers/connection';
import trackReducer from './store/reducers/track';
import authReducer from './store/reducers/auth';
import userReducer from './store/reducers/user';
import searchReducer from './store/reducers/search';

// Combine the different Reducers
const rootReducer = combineReducers({
	browse: browseReducer,
	submit: submitReducer,
	con: connectionReducer,
	track: trackReducer,
	auth: authReducer,
	user: userReducer,
	search: searchReducer
});

// Allows me to use the Redux Chrome Dev Tool
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Create the global redux store
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));

// Wrap the root app with the Browser Router - to allow routing - and the Provider - to provide access to redux store.
const app = (
	<Provider store={store}>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</Provider>
)

// Render this root Component to the DOM
ReactDOM.render(app, document.getElementById('root'));



