import React from "react";
import {IonButton, IonHeader, IonTitle, IonToolbar} from "@ionic/react";
import {useUserContext} from "../../context/UserContext";

export const PageHeader: React.FC = () => {
    const { user, signOut } = useUserContext();

    return (
        <IonHeader>
            <IonToolbar>
                <IonTitle style={{ textAlign: 'right' }}>
                    {user && <IonButton>{user.nick}</IonButton>}
                    {user && <IonButton onClick={signOut} fill="outline">Sign out</IonButton>}
                    {!user && <IonButton routerLink="/auth/sign-in" routerDirection="back" fill="outline">Sign in</IonButton>}
                </IonTitle>
            </IonToolbar>
        </IonHeader>
    );
};
