import { createAction } from 'redux-actions';

import { SAVE_REMAINDERS_DATA, CLEAN_REMAINDERS_DATA } from './RemaindersTypes';

import { RemaindersState } from './RemaindersInterfaces';

export const saveRemaindersData = createAction<RemaindersState>(SAVE_REMAINDERS_DATA);
export const cleanRemaindersData = createAction(CLEAN_REMAINDERS_DATA);

export type ActionsPayloadType = RemaindersState;
