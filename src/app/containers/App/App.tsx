import React, { ReactElement } from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase/app';
import { Provider } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';

import { firebaseAuth } from '../../modules/Firebase/FirebaseApp';
import store from '../../store';
import { LoggedUser } from '../../store/LoggedUser/LoggedUserInterface';
import { saveLoggedUserData, cleanLoggedUserData } from '../../store/LoggedUser/LoggedUserActions';
import { cleanRemaindersData } from '../../store/Remainders/RemaindersActions';
import history from '../../modules/History/BrowserHistory';

import Login from '../Login/Login';
import Loader from '../../components/Loader/Loader';
import Home from '../Home/Home';
import DayView from '../DayView/DayView';
import CreateRemainder from '../CreateRemainder/CreateRemainder';

import '../../../static/global.scss';

const App: React.FC = () => {
    return (
        <div>
            <p>Jobsity Calendar</p>
        </div>
    );
};

const renderApp = (): void => {
    ReactDOM.render(
        <Provider store={store}>
            <ConnectedRouter history={history}>
                <Switch>
                    <Route exact path="/" component={App} />
                    <Route path="/login" component={Login} />
                    <Route path="/home" component={Home} />
                    <Route
                        path="/day/:date"
                        component={(props: any): ReactElement => <DayView day={props.match.params.date} />}
                    />
                    <Route
                        path="/edit/:remainderId"
                        component={(props: any): ReactElement => (
                            <CreateRemainder remainderId={props.match.params.remainderId} />
                        )}
                    />
                    <Route path="/createRemainder" component={CreateRemainder} />
                    <Route component={Home} />
                </Switch>
            </ConnectedRouter>
        </Provider>,
        document.querySelector('#app'),
    );
};

firebaseAuth.onAuthStateChanged((firebaseUser: firebase.User) => {
    if (firebaseUser) {
        let loggedUserData: LoggedUser;
        if (firebaseUser.isAnonymous) {
            loggedUserData = {
                name: 'Anon User',
                uid: firebaseUser.uid,
                profilePicture: 'https://ssl.gstatic.com/images/branding/product/1x/avatar_circle_blue_512dp.png',
                email: 'email@anon.com',
                isAnonymous: firebaseUser.isAnonymous,
            };
        } else {
            loggedUserData = {
                name: firebaseUser.displayName,
                uid: firebaseUser.uid,
                profilePicture: 'firebaseUser.photoURL',
                email: firebaseUser.email,
                isAnonymous: firebaseUser.isAnonymous,
            };
        }

        store.dispatch(saveLoggedUserData(loggedUserData));
        renderApp();
        history.push('/home');
    } else {
        store.dispatch(cleanRemaindersData());
        store.dispatch(cleanLoggedUserData());
        renderApp();
        history.push('/login');
    }
});

ReactDOM.render(<Loader />, document.querySelector('#app'));
