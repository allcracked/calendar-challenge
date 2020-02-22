import { LoggedUserState } from './LoggedUserInterface';

const loggedUserInitialState: LoggedUserState = {
    userData: {
        name: '',
        uid: '',
        profilePicture: '',
        email: '',
        isAnonymous: false,
    },
    isAuth: false,
};

export default loggedUserInitialState;
