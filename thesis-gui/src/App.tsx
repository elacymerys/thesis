import {Redirect, Route} from 'react-router-dom';
import {
    IonApp,
    IonIcon,
    IonLabel,
    IonLoading,
    IonRouterOutlet,
    IonTabBar,
    IonTabButton,
    IonTabs,
    setupIonicReact
} from '@ionic/react';
import {IonReactRouter} from '@ionic/react-router';
import React, {FC, useCallback} from "react";
import {ellipse, square, triangle} from "ionicons/icons";
import {SignUp} from "./components/auth/sign-up/SignUp";
import {SignIn} from "./components/auth/sign-in/SignIn";
import {ErrorPage} from "./components/common/ErrorPage";
import {HomePage} from "./components/category/HomePage";
import {Question} from "./components/question/Question";
import {MyAccount} from "./components/my-account/MyAccount";
import {MyQuizzes} from "./components/my-quizzes/MyQuizzes";
import {Quizz} from "./components/quiz/Quizz";
import {useUserContext} from "./context/UserContext";

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: FC = () => {
    const { user, loadingState } = useUserContext();

    const AuthRoute: FC<{ path: string }> = useCallback(({ path, children }) => (
        <Route exact path={path}>
            {loadingState === 'UNAUTHORIZED' && <Redirect to="auth/sign-in"/>}
            {loadingState === 'FAILURE' && <Redirect to="error-page"/>}
            {loadingState === 'SUCCESS' && [children] }
            {loadingState === 'LOADING' && <></>}
        </Route>
    ), [loadingState]);

    return (
        <IonApp>
            <IonLoading isOpen={loadingState === 'LOADING'}/>
            <IonReactRouter>
                <IonTabs>
                    <IonRouterOutlet>
                        <Route exact path="/auth/sign-up">
                            <SignUp/>
                        </Route>
                        <Route exact path="/auth/sign-in">
                            <SignIn/>
                        </Route>
                        <AuthRoute path="/categories">
                            <HomePage/>
                        </AuthRoute>
                        <AuthRoute path="/questions">
                            <Question/>
                        </AuthRoute>
                        <AuthRoute path="/quizz">
                            <Quizz/>
                        </AuthRoute>
                        <AuthRoute path="/my-quizzes">
                            <MyQuizzes />
                        </AuthRoute>
                        <AuthRoute path="/my-account">
                            <MyAccount />
                        </AuthRoute>
                        <Route exact path="/error-page">
                            <ErrorPage/>
                        </Route>
                        <Route exact path="/">
                            <Redirect to="/categories"/>
                        </Route>
                    </IonRouterOutlet>
                    <IonTabBar slot="bottom">
                        <IonTabButton tab="tab1" href="/categories" disabled={ !user }>
                            <IonIcon icon={triangle} />
                            <IonLabel>Play</IonLabel>
                        </IonTabButton>
                        <IonTabButton tab="tab2" href="/my-quizzes" disabled={ !user }>
                            <IonIcon icon={ellipse} />
                            <IonLabel>My Quizzes</IonLabel>
                        </IonTabButton>
                        <IonTabButton tab="tab3" href="/my-account" disabled={ !user }>
                            <IonIcon icon={square} />
                            <IonLabel>My Account</IonLabel>
                        </IonTabButton>
                    </IonTabBar>
                </IonTabs>
            </IonReactRouter>
        </IonApp>
    );
};

export default App;
