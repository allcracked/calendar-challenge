import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase/app';

import { firebaseAuth } from '../../modules/Firebase/FirebaseApp';

import Login from '../Login/Login';

import '../../../static/global.scss';
import styles from './App.module.scss';

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
});

ReactDOM.render(<App />, document.querySelector('#app'));
