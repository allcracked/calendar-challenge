import firebase from 'firebase/app';
import moment from 'moment';

import { firebaseDb } from '../../Firebase/FirebaseApp';
import { RemainderObject } from '../../../store/Remainders/RemaindersInterfaces';

class RemaindersDAO {
    /**
     * Gets all the remainders for the user passed as parameter.
     * @param userID The User ID shared by the Google Login.
     * @returns A key: value object containing all the remainders.
     */
    async getUserRemainders(userID: string): Promise<RemainderObject> {
        const remaindersSnapshot: firebase.database.DataSnapshot = await firebaseDb
            .ref(`/remaindersByUID/${userID}`)
            .once('value');

        const remaindersData: RemainderObject = remaindersSnapshot.val();

        return remaindersData;
    }

    /**
     * Gets the remainders for the user and month passed as parameters.
     * @param userID The User ID shared by the Google Login.
     * @param month The month of the year, starting from 0 and ending at 11.
     * @returns A key: value object containing all the remainders.
     */
    async getMonthUserRemainders(userID: string, month: number): Promise<RemainderObject> {
        const monthStart = moment()
            .month(month)
            .startOf('month')
            .unix();
        const monthEnd = moment()
            .month(month)
            .endOf('month')
            .unix();

        const remaidersSnapshot: firebase.database.DataSnapshot = await firebaseDb
            .ref(`/remaindersByUID/${userID}`)
            .orderByChild('startTime')
            .startAt(monthStart)
            .endAt(monthEnd)
            .once('value');

        const remaindersData: RemainderObject = remaidersSnapshot.val();

        return remaindersData;
    }
}

const remaindersDAOInstance = new RemaindersDAO();
export default remaindersDAOInstance;
