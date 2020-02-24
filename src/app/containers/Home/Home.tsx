import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import { firebaseAuth } from '../../modules/Firebase/FirebaseApp';
import { AppState } from '../../store';
import thunkGetRemaindersData from '../../store/Remainders/RemaindersThunks';
import history from '../../modules/History/BrowserHistory';

import Calendar from '../../components/Calendar/Calendar';

const Home: React.FC = () => {
    const userData = useSelector((state: AppState) => state.loggedUser.userData);
    const remaindersData = useSelector((state: AppState) => state.remainders);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(thunkGetRemaindersData(userData.uid, moment().month(), moment().year()));
    }, []);

    const logout = (): void => {
        firebaseAuth.signOut();
    };

    const handlerCreateNewRemainder = (): void => {
        history.push('/createRemainder/');
    };

    return (
        <div>
            <h1>Home</h1>
            <Calendar />

            <button type="button" onClick={logout}>
                Logout
            </button>
            <button type="button" onClick={handlerCreateNewRemainder}>
                Create New Remainder
            </button>
        </div>
    );
};

export default Home;
