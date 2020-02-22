export interface LoggedUser {
    name: string;
    uid: string;
    profilePicture: string;
    email: string;
    isAnonymous: boolean;
}

export interface LoggedUserState {
    userData: LoggedUser;
    isAuth: boolean;
}
