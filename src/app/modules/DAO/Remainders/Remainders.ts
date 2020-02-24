import firebase from 'firebase/app';
import moment from 'moment';

import { firebaseDb } from '../../Firebase/FirebaseApp';
import { RemainderObject, RemainderInterface } from '../../../store/Remainders/RemaindersInterfaces';

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

    async getRemainderByUserAndId(userID: string, remainderId: string): Promise<RemainderInterface> {
        const remainderSnap: firebase.database.DataSnapshot = await firebaseDb
            .ref(`/remaindersByUID/${userID}/${remainderId}`)
            .once('value');

        if (!remainderSnap.exists()) return null;

        const remainder: RemainderInterface = remainderSnap.val();

        return remainder;
    }

    async getRemaindersByUserAndDay(userID: string, timestamp: number): Promise<RemainderInterface[]> {
        const startOfDay = moment
            .unix(timestamp)
            .startOf('day')
            .unix();
        const endOfDay = moment
            .unix(timestamp)
            .endOf('day')
            .unix();

        const remaindersSnap: firebase.database.DataSnapshot = await firebaseDb
            .ref(`/remaindersByUID/${userID}`)
            .orderByChild('startTime')
            .startAt(startOfDay)
            .endAt(endOfDay)
            .once('value');

        if (!remaindersSnap.exists()) return [];

        const remaindersData: RemainderObject = remaindersSnap.val();
        const returnRemainders: RemainderInterface[] = [];

        Object.values(remaindersData).forEach(remainder => {
            returnRemainders.push(remainder);
        });

        return returnRemainders;
    }

    async getRemaindersByUserAndTimeRange(
        userID: string,
        startTimestamp: number,
        endTimestamp: number,
    ): Promise<RemainderObject> {
        const startOfDay = moment
            .unix(startTimestamp)
            .startOf('day')
            .unix();
        const endOfDay = moment
            .unix(endTimestamp)
            .endOf('day')
            .unix();

        const remaindersSnap: firebase.database.DataSnapshot = await firebaseDb
            .ref(`/remaindersByUID/${userID}`)
            .orderByChild('startTime')
            .startAt(startOfDay)
            .endAt(endOfDay)
            .once('value');

        if (!remaindersSnap.exists()) return null;

        const remaindersData: RemainderObject = remaindersSnap.val();

        return remaindersData;
    }

    async setRemainderByUser(userID: string, remainder: RemainderInterface): Promise<boolean> {
        const savingRemainder: RemainderInterface = remainder;
        try {
            const newRemainderKey = await firebaseDb.ref(`/remaindersByUID/${userID}/`).push().key;
            savingRemainder.remainderId = newRemainderKey;
            await firebaseDb.ref(`/remaindersByUID/${userID}/${newRemainderKey}`).set(savingRemainder);
            return true;
        } catch (error) {
            return false;
        }
    }

    async setRemainderByUserAndRemainderId(
        userID: string,
        remainderID: string,
        remainder: RemainderInterface,
    ): Promise<boolean> {
        try {
            await firebaseDb.ref(`/remaindersByUID/${userID}/${remainder.remainderId}`).update(remainder);
            return true;
        } catch (error) {
            return false;
        }
    }
}

const remaindersDAOInstance = new RemaindersDAO();
export default remaindersDAOInstance;
