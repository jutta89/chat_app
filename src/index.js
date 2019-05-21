import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css'; 
import 'mdbreact/dist/css/mdb.css';

import './scss/_index.scss';

// redux
import thunkMiddleware from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux'; 
import rootReducer from './reducers/index';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // chrome redux dev tools

const store = createStore (
    rootReducer, 
    composeEnhancers ( 
        applyMiddleware(thunkMiddleware), 
    ),
);

ReactDOM.render(
    <Provider store={ store }>
        <App />
        
    </Provider>, 
    document.getElementById('root')
);

registerServiceWorker(); 


