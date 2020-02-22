import firebase from 'firebase/app';
import FirebaseConfig from './FirebaseConfig';

require('firebase/auth');
require('firebase/database');
require('firebase/analytics');

export const firebaseApp: firebase.app.App = firebase.initializeApp(FirebaseConfig);
firebase.analytics();
export const firebaseDb: firebase.database.Database = firebaseApp.database();
export const firebaseAuth: firebase.auth.Auth = firebaseApp.auth();
