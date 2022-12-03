import React from "react";
import {IonHeader, IonTitle, IonToolbar} from "@ionic/react";

export const PageHeader: React.FC<{
    name: string
}> = ({ name }) => {
    return (
        <IonHeader>
            <IonToolbar style={{ textAlign: "center" }}>
                <IonTitle>{ name }</IonTitle>
            </IonToolbar>
        </IonHeader>
    );
}
