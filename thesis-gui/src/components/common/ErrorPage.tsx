import React from "react";
import {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import {PageHeader} from "./PageHeader";

export const ErrorPage: React.FC = () => {
    const refreshApp = () => window.location.replace('/');

    return (
        <IonPage>
            <PageHeader/>
            <IonContent className="ion-padding">
                <IonHeader>
                    <IonToolbar>
                        <IonTitle size="large">Unexpected error</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonButtons>
                    <IonButton
                        onClick={refreshApp}
                        style={{margin: '10px auto 10px auto'}}
                    >
                        Refresh app
                    </IonButton>
                </IonButtons>
            </IonContent>
        </IonPage>
    );
};
