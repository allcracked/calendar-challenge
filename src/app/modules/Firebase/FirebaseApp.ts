import firebase from 'firebase/app';
import FirebaseConfig from './FirebaseConfig';

require('firebase/auth');
require('firebase/database');

export const firebaseApp: firebase.app.App = firebase.initializeApp(FirebaseConfig);
export const firebaseDb: firebase.database.Database = firebaseApp.database();
export const firebaseAuth: firebase.auth.Auth = firebaseApp.auth();
