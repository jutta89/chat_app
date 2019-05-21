import moment from 'moment';
import { sha256 } from 'js-sha256';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';

// REGISTER
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const SHOW_ERROR = 'SHOW_ERROR';
export const SHOW_PANEL = 'SHOW_PANEL';
export const CHANGE_PASSWORD = 'CHANGE_PASSWORD';
export const UPDATE_USER = 'UPDATE_USER';
export const updateUser = (user) => {
    return {
        type: UPDATE_USER,
        user: user
    }
}

export const showError = (message) => {
    return {
        type: SHOW_ERROR,
        message: message
    }
}

export const loginSuccess = (user, firstLogin = false) => {
    return {
        type: LOGIN_SUCCESS,
        user: user,
        firstLogin,
    };
}

export const logoutSuccess = () => {
    return {
        type: LOGOUT_SUCCESS,
    };
}

// REGISTER
export const registerSuccess = () => {
    return {
        type: REGISTER_SUCCESS,
    };
}

// SHOW PANEL
export const showPanel = (on) => {
    return {
        type: SHOW_PANEL,
        panelOn: on,
    };
}

//  CHANGE PASSWORD
export const changePassword = (newPassword) => {
    return {
        type: CHANGE_PASSWORD,
        password: newPassword,
    };
}

// CONNECT TO API
export const login = (login, password) => {
    return (dispatch) => {
        const requestOptions = {
            method: 'POST',
            body: JSON.stringify(
                { 
                    email: login, 
                    password: sha256(password) 
                }
            )
        };
        return fetch('https://vps603762.ovh.net:8443/DbApi/chatapp/user/GET', requestOptions).then(
            // sucess
            (response) => {
                if (response.ok) {
                    console.log(response);
                    return response.json().then(res => {
                        dispatch(loginSuccess({...res, password: sha256(password)}));
                        return;
                    })
                }
                // nie ma usera z takim loginem
                if (response.status == 462 ) {
                    console.log('rejestr');
                    dispatch(loginSuccess({name: login, email: login, password: sha256(password)}, true));
                    return;
                }
                if (response.status == 465 ) {
                    console.log('dokoncz rejestracje');
                    dispatch(loginSuccess({name: login, email: login, password: sha256(password)}, true));
                    return;
                }
                console.log('nie rejestr');

                return response.status;
            },
            // error
            (response) => {
                console.log(response);
                return response;
            },
        );
    };
};

const firstRegister = (login, password) => {
    const requestOptions = {
        method: 'POST',
        body: JSON.stringify(
            { 
                email: login, 
                password: sha256(password) 
            }
        )
    };

    return fetch('https://vps603762.ovh.net:8443/DbApi/chatapp/user', requestOptions).then(
        (response) => {
            if (response.ok) {
                console.log(response.data);
                return;
            }
            console.log(response.status);

            return response.status;
        },
        (response) => {
            console.log(response);
            return response;
        },
    );
}



export const deleteUser = (login, password) => {
    return (dispatch) => {
        const requestOptions = {
            method: 'DELETE',
            // headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(
                { 
                    email: login, 
                    password: sha256(password)
                    // password: password
                }
            )
        };

        return fetch('https://vps603762.ovh.net:8443/DbApi/chatapp/user', requestOptions).then(
            // sucess
            (response) => {
                if (response.ok) {
                    console.log(response);
                    var logoutFunc = logout();
                    logoutFunc(dispatch);
                    return;
                }
                return response.status;
            },
            // error
            (response) => {
                console.log(response);
                return response;
            },
        );
    };
};

export const logout = () => {
    return (dispatch) => {
        dispatch(logoutSuccess());
        localStorage.removeItem('loggedIn'); 
    }
};

export const register = (email, name, password, birth, sex) => {

    return (dispatch) => {
        const requestOptions = {
            method: 'POST',
            body: JSON.stringify({
                name: name,
                password: sha256(password),
                email: email,
                sex: sex === 'M' ? 1 : 2,
                dateOfBirth: moment(birth).format('DD-MM-YYYY')
            })
        };

        return firstRegister(email, password).then(result => {
            if (!result) {
                return fetch('https://vps603762.ovh.net:8443/DbApi/chatapp/user/FIRST', requestOptions).then(
                    (response) => {                
                        if (response.ok) {
                            console.log(response);
                            return response.json().then(res => {
                                dispatch(loginSuccess({...res, password: sha256(password)}));
                                return;
                            })
                        }
                        return response.status;
                    },
                    (response) => {
                        console.log(response);
                        return response;
                    },
                );
            }

            return result;
        });
    };
};

export const changePass = (login, password, newPassword) => {
    return (dispatch) => {
        const requestOptions = {
            method: 'PUT',
            body: JSON.stringify(
                {
                    email: login, 
                    password: sha256(password),
                    newPassword: sha256(newPassword)
                }
            )
        };
        return fetch('https://vps603762.ovh.net:8443/DbApi/chatapp/user/PASS', requestOptions).then(
            (response) => {
                if (response.ok) {
                    dispatch(changePassword(sha256(newPassword)));
                    return;
                }
                return response.status;
            },
            (response) => {
                console.log(response);
                return response;
            },
        );
    };
};