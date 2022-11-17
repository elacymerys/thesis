import React from "react";
import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import {UserInfo} from "./UserInfo";
import {UserRanking} from "./UserRanking";

export const MyAccount: React.FC = () => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar style={{ textAlign: "center" }}>
                    <IonTitle>My Account</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonHeader collapse="condense">
                    <IonToolbar style={{ textAlign: "center" }}>
                        <IonTitle>My Account</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <UserInfo />
                <UserRanking />
            </IonContent>
        </IonPage>
    );
}
