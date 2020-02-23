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
                usingMonth: remaindersData.usingMonth,
            };
        },
        [CLEAN_REMAINDERS_DATA]: state => {
            return {
                ...state,
                remainders: remaindersInitialState.remainders,
                mappedRemainders: remaindersInitialState.mappedRemainders,
                usingMonth: remaindersInitialState.usingMonth,
            };
        },
    },
    remaindersInitialState,
);

export default remaindersReducer;
