import React from "react";
import {useUserContext} from "../../context/UserContext";
import {IonAvatar, IonButton, IonCard, IonCardContent, IonCardSubtitle, IonCardTitle} from "@ionic/react";

export const UserInfo: React.FC = () => {
    const { user, signOut } = useUserContext();

    return (
        <IonCard>
            <IonCardContent style={{ textAlign: "center" }}>
                <IonAvatar style={{ display: "block", marginLeft: "auto", marginRight: "auto" }}>
                    <img alt="User's avatar" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
                </IonAvatar>
                <IonCardContent>
                    <IonCardTitle>
                        { user!.nick }
                    </IonCardTitle>
                    <IonCardSubtitle>
                        { user!.email }
                    </IonCardSubtitle>
                </IonCardContent>
                <IonButton expand="block" onClick={ signOut }>
                    Sign Out
                </IonButton>
            </IonCardContent>
        </IonCard>
    );
}