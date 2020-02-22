import React from 'react';
import ReactDOM from 'react-dom';

import Login from '../Login/Login';

import '../../../static/global.scss';
import styles from './App.module.scss';

const App: React.FC = () => {
    return (
        <div>
            <h1>Hello there!</h1>
            <p className={styles.paragraph}>This is a paragraph.</p>
            <Login />
        </div>
    );
};

ReactDOM.render(<App />, document.querySelector('#app'));
