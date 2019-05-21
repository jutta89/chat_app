import { LOGIN_SUCCESS, LOGOUT_SUCCESS, SHOW_PANEL, CHANGE_PASSWORD, UPDATE_USER } from '../actions/authentication';

const initialState = {
    loggedUser: JSON.parse(localStorage.getItem('loggedIn')),
    firstLogin: false,
    showPanel: false,

};



export function authentication(state = initialState, action) {
    switch (action.type) {
        case LOGIN_SUCCESS:
            localStorage.setItem('loggedIn', JSON.stringify(action.user))
            return {
                ...state, // bierzemu aktualny state (...); 
                loggedUser: action.user,
                firstLogin: action.firstLogin,
            };
        case LOGOUT_SUCCESS:
            return {
                ...state,
                loggedUser: null,
                firstLogin: false,
            }
        case SHOW_PANEL:
            return {
                ...state,
                showPanel: action.panelOn,
            }

        case CHANGE_PASSWORD:
            if (state.loggedUser) {
                const user = { ...state.loggedUser, password: action.password}
                localStorage.setItem('loggedIn', JSON.stringify(user))
                return {
                    ...state,
                    loggedUser: user,
                }     
            }
            return state;
        case UPDATE_USER:
            localStorage.setItem('loggedIn', JSON.stringify(action.user));
            return {
                ...state,
                loggedUser: action.user
            }
        default: 
            return state;    
    }
}