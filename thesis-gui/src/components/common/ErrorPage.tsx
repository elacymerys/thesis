import React from "react";
import {
    IonButton,
    IonButtons,
    IonContent,
    IonPage
} from "@ionic/react";
import {PageHeader} from "./PageHeader";

const PAGE_NAME = "Unexpected Error";

export const ErrorPage: React.FC = () => {
    const refreshApp = () => window.location.replace('/');

    return (
        <IonPage>
            <PageHeader name={ PAGE_NAME } />
            <IonContent className="ion-padding">
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
}
