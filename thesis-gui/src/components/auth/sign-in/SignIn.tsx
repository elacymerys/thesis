import React, {useMemo, useState} from "react";
import {
    IonButton,
    IonContent, IonInput, IonItem, IonLabel,
    IonPage, IonRouterLink,
} from "@ionic/react";
import './SignIn.css';
import {useUserContext} from "../../../context/UserContext";
import {useHistory} from "react-router";
import {ApiError, isApiError} from "../../../types/api-error";
import {HttpStatusCode} from "../../../utils/http-status-code";
import {validateEmail, validateNick, validatePassword} from "../../../utils/validators";
import {FormErrorMessage} from "../../common/FormErrorMessage";
import {PageHeader} from "../../common/PageHeader";

const PAGE_NAME = "Sign In";

export const SignIn: React.FC = () => {
    const { signIn } = useUserContext();
    const history = useHistory();

    const [login, setLogin] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const [loginError, setLoginError] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');

    const [apiError, setApiError] = useState<string>('');

    const handleSignIn = () => {
        signIn({ login, password })
            .then(() => history.push('/play'))
            .catch(err => {
                if (isApiError(err) && (err as ApiError).apiStatusCode === HttpStatusCode.UNAUTHORIZED) {
                    setApiError('Login or password incorrect!');
                } else {
                    history.push('/error-page');
                }
            });
    };

    const handleLoginChange = (loginValue: string) => {
        setApiError('');

        setLogin(loginValue);
        const nickError = validateNick(loginValue);
        const emailError = validateEmail(loginValue);

        if (nickError && emailError) {
            setLoginError(`Login must be a valid nick or email:
                            ${nickError}; 
                            ${emailError}`);
        } else {
            setLoginError('');
        }
    };

    const handlePasswordChange = (passwordValue: string) => {
        setApiError('');

        setPassword(passwordValue);
        setPasswordError(validatePassword(passwordValue));
    };

    const isValid = useMemo<boolean>(
        () => !!login && !!password && !loginError && !passwordError,
        [login, password, loginError, passwordError]
    );

    return (
        <IonPage>
            <PageHeader name={ PAGE_NAME } />
            <IonContent class="ion-padding">
                <IonItem>
                    <IonLabel position="floating">Login</IonLabel>
                    <IonInput onIonChange={e => handleLoginChange(e.detail.value as string)} type="text" required/>
                </IonItem>
                <FormErrorMessage>{loginError}</FormErrorMessage>

                <IonItem>
                    <IonLabel position="floating">Password</IonLabel>
                    <IonInput onIonChange={e => handlePasswordChange(e.detail.value as string)} type="password" required/>
                </IonItem>
                <FormErrorMessage>{passwordError}</FormErrorMessage>

                <IonButton
                    onClick={handleSignIn}
                    disabled={!isValid}
                    expand="full">
                    Sign In
                </IonButton>
                <FormErrorMessage>{apiError}</FormErrorMessage>
                <IonRouterLink routerDirection="back" routerLink="/auth/sign-up">Don't have an account? Sign Up</IonRouterLink>
            </IonContent>
        </IonPage>
    );
}
