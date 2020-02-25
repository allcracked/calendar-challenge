import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import Container from 'react-bootstrap/Container';

import { firebaseAuth } from '../../modules/Firebase/FirebaseApp';
import { AppState } from '../../store';
import thunkGetRemaindersData from '../../store/Remainders/RemaindersThunks';
import history from '../../modules/History/BrowserHistory';

import Calendar from '../../components/Calendar/Calendar';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

const Home: React.FC = () => {
    const userData = useSelector((state: AppState) => state.loggedUser.userData);
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
            <Header />
            <Container>
                <Calendar />
            </Container>
            <Footer />
        </div>
    );
};

export default Home;
