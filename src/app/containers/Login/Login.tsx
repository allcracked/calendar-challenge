import React from 'react';
import firebase from 'firebase/app';

import { firebaseAuth } from '../../modules/Firebase/FirebaseApp';

import styles from './Login.module.scss';

const Login: React.FC = () => {
    const login = (): void => {
        const googleProvider = new firebase.auth.GoogleAuthProvider();
        firebaseAuth.signInWithPopup(googleProvider);
    };

    const anonymousLogin = (): void => {
        firebaseAuth.signInAnonymously();
    };

    return (
        <div>
            <p className={styles.para}>This is a login page.</p>
            <button type="button" onClick={login}>
                Login
            </button>
            <button type="button" onClick={anonymousLogin}>
                Anonymous Login
            </button>
        </div>
    );
};

export default Login;
