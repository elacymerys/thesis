import React, {useMemo, useState} from "react";
import {
    IonButton,
    IonContent, IonInput, IonItem, IonLabel,
    IonPage, IonRouterLink,
} from "@ionic/react";
import './SignUp.css';
import {useUserContext} from "../../../context/UserContext";
import {useHistory} from "react-router";
import {ApiError, isApiError} from "../../../types/api-error";
import {HttpStatusCode} from "../../../utils/http-status-code";
import {validateEmail, validateNick, validatePassword} from "../../../utils/validators";
import {FormErrorMessage} from "../../common/FormErrorMessage";
import {PageHeader} from "../../common/PageHeader";

const PAGE_NAME = "Sign Up";

export const SignUp: React.FC = () => {
    const { signUp } = useUserContext();
    const history = useHistory();

    const [nick, setNick] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [repeatPassword, setRepeatPassword] = useState<string>('');

    const [nickError, setNickError] = useState<string>('');
    const [emailError, setEmailError] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');
    const [repeatPasswordError, setRepeatPasswordError] = useState<string>('');

    const [apiError, setApiError] = useState<string>('');

    const handleSignUp = () => {
        signUp({ nick, email, password })
            .then(() => history.push('/play'))
            .catch(err => {
                if (isApiError(err) && (err as ApiError).apiStatusCode === HttpStatusCode.CONFLICT) {
                    setApiError('User with this nick or email already exists!');
                } else {
                    history.push('/error-page');
                }
            });
    };

    const handleNickChange = (nickValue: string) => {
        setApiError('');

        setNick(nickValue);
        setNickError(validateNick(nickValue));
    };

    const handleEmailChange = (emailValue: string) => {
        setApiError('');

        setEmail(emailValue);
        setEmailError(validateEmail(emailValue));
    };

    const handlePasswordChange = (passwordValue: string) => {
        setApiError('');

        setPassword(passwordValue);
        setPasswordError(validatePassword(passwordValue));
        setRepeatPasswordError(passwordValue === repeatPassword ? '' : 'Passwords do not match!');
    };

    const handleRepeatPasswordChange = (repeatPasswordValue: string) => {
        setApiError('');

        setRepeatPassword(repeatPasswordValue);
        setRepeatPasswordError(password === repeatPasswordValue ? '' : 'Passwords do not match!');
    };

    const isValid = useMemo<boolean>(
        () => !!nick && !!email && !!password && !!repeatPassword && !nickError && !emailError && !passwordError && !repeatPasswordError,
        [nick, email, password, repeatPassword, nickError, emailError, passwordError, repeatPasswordError]
    );

    return (
        <IonPage>
            <PageHeader name={ PAGE_NAME } />
            <IonContent className="ion-padding">
                <IonItem>
                    <IonLabel position="floating">Nick</IonLabel>
                    <IonInput onIonChange={e => handleNickChange(e.detail.value as string)} type="text" required/>
                </IonItem>
                <FormErrorMessage>{nickError}</FormErrorMessage>

                <IonItem>
                    <IonLabel position="floating">Email</IonLabel>
                    <IonInput onIonChange={e => handleEmailChange(e.detail.value as string)} type="email" required/>
                </IonItem>
                <FormErrorMessage>{emailError}</FormErrorMessage>

                <IonItem>
                    <IonLabel position="floating">Password</IonLabel>
                    <IonInput onIonChange={e => handlePasswordChange(e.detail.value as string)} type="password" required/>
                </IonItem>
                <FormErrorMessage>{passwordError}</FormErrorMessage>

                <IonItem>
                    <IonLabel position="floating">Repeat password</IonLabel>
                    <IonInput onIonChange={e => handleRepeatPasswordChange(e.detail.value as string)} type="password" required/>
                </IonItem>
                <FormErrorMessage>{repeatPasswordError}</FormErrorMessage>

                <IonButton
                    onClick={handleSignUp}
                    expand="full"
                    disabled={!isValid}
                >
                    Sign Up
                </IonButton>
                <FormErrorMessage>{apiError}</FormErrorMessage>
                <IonRouterLink routerDirection="back" routerLink="/auth/sign-in">Already have an account? Sign In</IonRouterLink>
            </IonContent>
        </IonPage>
    );
}
