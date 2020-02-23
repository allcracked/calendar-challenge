import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import { firebaseAuth } from '../../modules/Firebase/FirebaseApp';
import { AppState } from '../../store';
import thunkGetRemaindersData from '../../store/Remainders/RemaindersThunks';

const Calendar: React.FC = () => {
    const userData = useSelector((state: AppState) => state.loggedUser.userData);
    const remaindersData = useSelector((state: AppState) => state.remainders);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(thunkGetRemaindersData(userData.uid, moment().month()));
    }, []);

    const logout = (): void => {
        firebaseAuth.signOut();
    };

    return (
        <div>
            <h1>Calendar</h1>
            <ul>
                {remaindersData.mappedRemainders.map((day): JSX.Element[] => {
                    if (day.length > 0) {
                        return day.map(remainder => {
                            const remainderInfo = remaindersData.remainders[remainder];
                            return <li key={remainder}>{remainderInfo.content}</li>;
                        });
                    }
                    return null;
                })}
            </ul>

            <button type="button" onClick={logout}>
                Logout
            </button>
        </div>
    );
};

export default Calendar;
