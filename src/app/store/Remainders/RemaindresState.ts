import { RemaindersState } from './RemaindersInterfaces';

const initialRemaindersState: RemaindersState = {
    remainders: {},
    mappedRemainders: [],
    currentCalendar: [],
    usingMonth: null,
};

export default initialRemaindersState;
