import { RemaindersState } from './RemaindersInterfaces';

const initialRemaindersState: RemaindersState = {
    remainders: {},
    mappedRemainders: [],
    currentCalendar: [],
    usingMonth: null,
    usingYear: null,
};

export default initialRemaindersState;
