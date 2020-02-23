import { Dispatch } from 'redux';
import moment from 'moment';

import { RemaindersState, RemainderObject, RemainderMap } from './RemaindersInterfaces';
import { saveRemaindersData } from './RemaindersActions';
import RemaindersDAO from '../../modules/DAO/Remainders/Remainders';

function initializeRemaindersMap(month: number): RemainderMap {
    const monthStarts = moment()
        .month(month)
        .startOf('month')
        .date();
    const monthEnds = moment()
        .month(month)
        .endOf('month')
        .date();

    const calendarDaysArray: RemainderMap = [];
    for (let i: number = monthStarts; i <= monthEnds; i += 1) {
        calendarDaysArray[i] = [];
    }

    return calendarDaysArray;
}

function mapRemaindersByDay(rawRemainders: RemainderObject, month: number): RemainderMap {
    const mappedRemainders: RemainderMap = initializeRemaindersMap(month);
    const remaindersArray = Object.entries(rawRemainders);

    remaindersArray.forEach(remainder => {
        const remainderDay = moment.unix(remainder[1].startTime).date();
        if (!mappedRemainders[remainderDay]) mappedRemainders[remainderDay] = [];
        mappedRemainders[remainderDay].push(remainder[0]);
    });

    return mappedRemainders;
}

const thunkGetRemaindersData = (userId: string, month: number) => async (dispatch: Dispatch): Promise<void> => {
    const remaindersData: RemainderObject = await RemaindersDAO.getMonthUserRemainders(userId, month);
    const mappedRemainders: RemainderMap = mapRemaindersByDay(remaindersData, month);

    const remaindersSavingData: RemaindersState = {
        remainders: remaindersData,
        mappedRemainders,
    };
    dispatch(saveRemaindersData(remaindersSavingData));
};

export default thunkGetRemaindersData;
