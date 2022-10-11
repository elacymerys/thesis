import React from "react";
import {
    IonButton,
    IonContent, IonHeader, IonInput,
    IonPage, IonRouterLink, IonTitle, IonToolbar,
} from "@ionic/react";
import './SignIn.css';

const SignIn: React.FC = () => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Sign In</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Sign In</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonInput type="text" required placeholder="Login" />
                <IonInput type="password" required placeholder="Password" />
                <IonButton expand="full">Sign In</IonButton>
                <IonRouterLink href="/auth/sign-up">Don't have an account? Sign Up</IonRouterLink>
            </IonContent>
        </IonPage>
    );
};

export default SignIn;
