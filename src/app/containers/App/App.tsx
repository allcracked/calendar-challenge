import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase/app';
import { Provider } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';

import { firebaseAuth } from '../../modules/Firebase/FirebaseApp';
import store from '../../store';
import { LoggedUser } from '../../store/LoggedUser/LoggedUserInterface';
import { saveLoggedUserData, cleanLoggedUserData } from '../../store/LoggedUser/LoggedUserActions';
import history from '../../modules/History/BrowserHistory';

import Login from '../Login/Login';
import Loader from '../../components/Loader/Loader';
import Calendar from '../Calendar/Calendar';

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
                    <Route path="/home" component={Calendar} />
                </Switch>
            </ConnectedRouter>
        </Provider>,
        document.querySelector('#app'),
    );
};

firebaseAuth.onAuthStateChanged((firebaseUser: firebase.User) => {
    if (firebaseUser) {
        const loggedUserData: LoggedUser = {
            name: firebaseUser.displayName,
            uid: firebaseUser.uid,
            profilePicture: firebaseUser.photoURL,
            email: firebaseUser.email,
            isAnonymous: firebaseUser.isAnonymous,
        };

        store.dispatch(saveLoggedUserData(loggedUserData));
        renderApp();
        history.push('/home');
    } else {
        store.dispatch(cleanLoggedUserData());
        renderApp();
        history.push('/login');
    }
});

ReactDOM.render(<Loader />, document.querySelector('#app'));
