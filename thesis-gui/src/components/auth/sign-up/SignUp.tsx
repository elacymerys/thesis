import React from "react";
import {
    IonButton,
    IonContent, IonHeader, IonInput,
    IonPage, IonRouterLink, IonTitle, IonToolbar,
} from "@ionic/react";
import './SignUp.css';

const SignUp: React.FC = () => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Sign Up</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Sign Up</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonInput type="text" required placeholder="Nickname" />
                <IonInput type="email" required placeholder="Email" />
                <IonInput type="password" required placeholder="Password" />
                <IonInput type="password" required placeholder="Repeat Password" />
                <IonButton expand="full">Sign Up</IonButton>
                <IonRouterLink href="/auth/sign-in">Already have an account? Sign in</IonRouterLink>
            </IonContent>
        </IonPage>
    );
};

export default SignUp;
