import React from "react";
import {
    IonAvatar,
    IonCard, IonCardContent, IonCardSubtitle, IonCardTitle,
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar
} from "@ionic/react";

const UserInfo: React.FC = () => {
    return (
        <IonCard>
            <IonCardContent style={{ textAlign: "center" }}>
                <IonAvatar style={{ display: "block", marginLeft: "auto", marginRight: "auto" }}>
                    <img alt="User's avatar" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
                </IonAvatar>
                <IonCardContent>
                    <IonCardTitle>
                        Nickname
                    </IonCardTitle>
                    <IonCardSubtitle>
                        nick@example.com
                    </IonCardSubtitle>
                </IonCardContent>
            </IonCardContent>
        </IonCard>
    );
}

const MyAccount: React.FC = () => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>My Account</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">My Account</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <UserInfo />
            </IonContent>
        </IonPage>
    );
}

export default MyAccount;
