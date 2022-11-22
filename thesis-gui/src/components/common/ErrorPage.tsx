import React from "react";
import {
    IonButton,
    IonButtons,
    IonContent,
    IonPage
} from "@ionic/react";
import {PageHeader} from "./PageHeader";

export const ErrorPage: React.FC = () => {
    const refreshApp = () => window.location.replace('/');

    return (
        <IonPage>
            <PageHeader name={ "Unexpected Error" } condense={ false } />
            <IonContent className="ion-padding">
                <PageHeader name={ "Unexpected Error" } condense={ true } />
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
