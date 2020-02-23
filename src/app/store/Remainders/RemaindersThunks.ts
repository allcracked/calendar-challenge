import { Dispatch } from 'redux';
import moment from 'moment';

import { RemaindersState, RemainderObject } from './RemaindersInterfaces';
import { saveRemaindersData } from './RemaindersActions';
import RemaindersDAO from '../../modules/DAO/Remainders/Remainders';

function mapRemaindersByDay(rawRemainders: RemainderObject): Array<Array<string>> {
    const mappedRemainders: Array<Array<string>> = [];
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
    const mappedRemainders: Array<Array<string>> = mapRemaindersByDay(remaindersData);

    const remaindersSavingData: RemaindersState = {
        remainders: remaindersData,
        mappedRemainders,
    };
    dispatch(saveRemaindersData(remaindersSavingData));
};

export default thunkGetRemaindersData;
