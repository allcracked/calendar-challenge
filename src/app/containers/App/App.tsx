import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase/app';
import { Provider } from 'react-redux';

import { firebaseAuth } from '../../modules/Firebase/FirebaseApp';
import configureStore from '../../store';
import { LoggedUser } from '../../store/LoggedUser/LoggedUserInterface';
import { saveLoggedUserData, cleanLoggedUserData } from '../../store/LoggedUser/LoggerUserActions';

import Login from '../Login/Login';

import '../../../static/global.scss';
import styles from './App.module.scss';

const store = configureStore();

const App: React.FC = () => {
    const login = (): void => {
        const googleProvider = new firebase.auth.GoogleAuthProvider();
        firebaseAuth.signInWithPopup(googleProvider);
    };

    const logout = (): void => {
        firebaseAuth.signOut();
    };

    return (
        <div>
            <h1>Hello there!</h1>
            <p className={styles.paragraph}>This is a paragraph.</p>
            <button type="button" onClick={login}>
                Login
            </button>
            <button type="button" onClick={logout}>
                Logout
            </button>
            <Login />
        </div>
    );
};

firebaseAuth.onAuthStateChanged((firebaseUser: firebase.User) => {
    console.log({ firebaseUser });
    if (firebaseUser) {
        const loggedUserData: LoggedUser = {
            name: firebaseUser.displayName,
            uid: firebaseUser.uid,
            profilePicture: firebaseUser.photoURL,
            email: firebaseUser.email,
            isAnonymous: firebaseUser.isAnonymous,
        };

        store.dispatch(saveLoggedUserData(loggedUserData));
    } else {
        store.dispatch(cleanLoggedUserData());
    }
});

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.querySelector('#app'),
);
