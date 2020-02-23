import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import { firebaseAuth } from '../../modules/Firebase/FirebaseApp';
import { AppState } from '../../store';
import thunkGetRemaindersData from '../../store/Remainders/RemaindersThunks';

import Calendar from '../../components/Calendar/Calendar';

const Home: React.FC = () => {
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
            <h1>Home</h1>
            <Calendar />

            <button type="button" onClick={logout}>
                Logout
            </button>
        </div>
    );
};

export default Home;