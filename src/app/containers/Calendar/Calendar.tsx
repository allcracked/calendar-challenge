import React from 'react';

import { firebaseAuth } from '../../modules/Firebase/FirebaseApp';

const Calendar: React.FC = () => {
    const logout = (): void => {
        firebaseAuth.signOut();
    };

    return (
        <div>
            <h1>Hello there!</h1>
            <p>This is a paragraph.</p>

            <button type="button" onClick={logout}>
                Logout
            </button>
        </div>
    );
};

export default Calendar;
