import { handleActions } from 'redux-actions';

import remaindersInitialState from './RemaindresState';
import { SAVE_REMAINDERS_DATA, CLEAN_REMAINDERS_DATA } from './RemaindersTypes';
import { ActionsPayloadType } from './RemaindersActions';
import { RemaindersState } from './RemaindersInterfaces';

const remaindersReducer = handleActions<RemaindersState, ActionsPayloadType>(
    {
        [SAVE_REMAINDERS_DATA]: (state, action) => {
            const remaindersData: RemaindersState = action.payload;
            return {
                ...state,
                remainders: remaindersData.remainders,
                mappedRemainders: remaindersData.mappedRemainders,
            };
        },
        [CLEAN_REMAINDERS_DATA]: state => {
            return {
                ...state,
                remainders: remaindersInitialState.remainders,
                mappedRemainders: remaindersInitialState.mappedRemainders,
            };
        },
    },
    remaindersInitialState,
);

export default remaindersReducer;
