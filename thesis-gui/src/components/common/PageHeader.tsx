import React from "react";
import {IonHeader, IonTitle, IonToolbar} from "@ionic/react";

export const PageHeader: React.FC<{
    name: string,
    condense: boolean
}> = ({name, condense}) => {
    return (
        <IonHeader collapse={ condense ? "condense" : undefined }>
            <IonToolbar style={{ textAlign: "center" }}>
                <IonTitle>{ name }</IonTitle>
            </IonToolbar>
        </IonHeader>
    );
};
