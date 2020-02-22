import { createAction } from 'redux-actions';

import { SAVE_LOGGED_USER_DATA, CLEAN_LOGGED_USER_DATA } from './LoggedUserTypes';
import { LoggedUser } from './LoggedUserInterface';

export const saveLoggedUserData = createAction<LoggedUser>(SAVE_LOGGED_USER_DATA);
export const cleanLoggedUserData = createAction(CLEAN_LOGGED_USER_DATA);

export type ActionsPayloadType = LoggedUser;
