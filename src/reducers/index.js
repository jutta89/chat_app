import { combineReducers } from 'redux';
import { authentication } from './authentication';
import { chat } from './chat';


// wszystkie reducery
const rootReducer = combineReducers  ({
    authentication: authentication,
    chat: chat,
});

export default rootReducer;
