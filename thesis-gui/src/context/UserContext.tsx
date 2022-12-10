import {createContext, FC, useContext, useEffect, useState} from "react";
import {User} from "../types/user";
import {userService} from "../services/user-service";
import {HttpStatusCode} from "../utils/http-status-code";
import {LoadingState} from "../types/loading-state";
import {ApiError, isApiError} from "../types/api-error";
import {SignInRequest} from "../types/sign-in-request";
import {SignUpRequest} from "../types/sign-up-request";

type UserContextLoadingState = LoadingState | 'UNAUTHORIZED';

type UserContextType = {
    loadingState: UserContextLoadingState,
    user?: User
    tryRefreshTokens: () => Promise<any>,
    signIn: (request: SignInRequest) => Promise<any>,
    signUp: (request: SignUpRequest) => Promise<any>,
    signOut: () => Promise<any>
};

const USER_CONTEXT_INIT_STATE: UserContextType = {
    loadingState: 'LOADING',
    user: undefined,
    tryRefreshTokens: () => Promise.reject(),
    signIn: () => Promise.reject(),
    signUp: () => Promise.reject(),
    signOut: () => Promise.reject()
};

const UserContext = createContext<UserContextType>(USER_CONTEXT_INIT_STATE);

export const UserContextProvider: FC = ({ children }) => {
    const [loadingState, setLoadingState] = useState<UserContextLoadingState>(USER_CONTEXT_INIT_STATE.loadingState);
    const [user, setUser] = useState<User | undefined>(USER_CONTEXT_INIT_STATE.user);

    const getUser = () => {
        setLoadingState('LOADING');
        userService.getUser()
            .then(setUser)
            .then(() => setLoadingState('SUCCESS'))
            .catch(err => {
                if (isApiError(err) && (err as ApiError).apiStatusCode === HttpStatusCode.UNAUTHORIZED) {
                    tryRefreshTokens().then(getUser);
                } else {
                    setUser(undefined);
                    setLoadingState('FAILURE');
                }
            });
    };

    const tryRefreshTokens = () => {
        return userService.refreshTokens()
            .then(setUser)
            .then(() => setLoadingState('SUCCESS'))
            .catch(err => {
                setUser(undefined);
                if (isApiError(err) && (err as ApiError).apiStatusCode === HttpStatusCode.UNAUTHORIZED) {
                    setLoadingState('UNAUTHORIZED');
                } else {
                    setLoadingState('FAILURE');
                }
                return Promise.reject(err);
            });
    };

    const signIn = (request: SignInRequest) => {
        setLoadingState('LOADING');
        return userService.signIn(request)
            .then(setUser)
            .then(() => setLoadingState('SUCCESS'))
            .catch(err => {
                if (isApiError(err) && (err as ApiError).apiStatusCode === HttpStatusCode.UNAUTHORIZED) {
                    setLoadingState('UNAUTHORIZED');
                } else {
                    setLoadingState('FAILURE');
                }
                return Promise.reject(err);
            });
    };

    const signUp = (request: SignUpRequest) => {
        setLoadingState('LOADING');
        return userService.signUp(request)
            .then(setUser)
            .then(() => setLoadingState('SUCCESS'))
            .catch(err => {
                if (isApiError(err) && (err as ApiError).apiStatusCode === HttpStatusCode.CONFLICT) {
                    setLoadingState('UNAUTHORIZED');
                } else {
                    setLoadingState('FAILURE');
                }
                return Promise.reject(err);
            });
    };

    const signOut = () => {
        setLoadingState('LOADING');
        return userService.signOut()
            .then(() => setUser(undefined))
            .then(() => setLoadingState('UNAUTHORIZED'))
            .catch(err => {
                setLoadingState('FAILURE');
                return Promise.reject(err);
            });
    };

    useEffect(getUser, []);

    return (
        <UserContext.Provider value={{ loadingState, user, tryRefreshTokens, signIn, signUp, signOut }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUserContext = () => useContext(UserContext);
