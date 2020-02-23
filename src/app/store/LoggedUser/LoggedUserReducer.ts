import { handleActions } from 'redux-actions';

import loggedUserInitialState from './LoggedUserState';
import { SAVE_LOGGED_USER_DATA, CLEAN_LOGGED_USER_DATA } from './LoggedUserTypes';
import { ActionsPayloadType } from './LoggedUserActions';
import { LoggedUser, LoggedUserState } from './LoggedUserInterface';

const loggedUserReducer = handleActions<LoggedUserState, ActionsPayloadType>(
    {
        [SAVE_LOGGED_USER_DATA]: (state, action) => {
            const loggedUserData: LoggedUser = action.payload;
            return {
                ...state,
                userData: loggedUserData,
                isAuth: true,
            };
        },

        [CLEAN_LOGGED_USER_DATA]: state => {
            return {
                ...state,
                userData: loggedUserInitialState.userData,
                isAuth: loggedUserInitialState.isAuth,
            };
        },
    },
    loggedUserInitialState,
);

export default loggedUserReducer;
