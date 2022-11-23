import React from "react";
import {
    IonContent,
    IonPage,
} from "@ionic/react";
import {UserInfo} from "./UserInfo";
import {UserRanking} from "./UserRanking";
import {PageHeader} from "../common/PageHeader";

const PAGE_NAME = "My Account";

export const MyAccount: React.FC = () => {
    return (
        <IonPage>
            <PageHeader name={ PAGE_NAME } />
            <IonContent className="ion-padding">
                <UserInfo />
                <UserRanking />
            </IonContent>
        </IonPage>
    );
}
