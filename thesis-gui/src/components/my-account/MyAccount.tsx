import React from "react";
import {
    IonAvatar, IonButton,
    IonCard, IonCardContent, IonCardSubtitle, IonCardTitle,
    IonContent,
    IonHeader, IonItem, IonLabel, IonList,
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
                <IonButton expand="block">
                    Sign Out
                </IonButton>
            </IonCardContent>
        </IonCard>
    );
}

const Ranking = () => {
  return (
      <IonCard>
          <IonCardContent>
              <IonCardTitle style={{ textAlign: "center" }}>
                  My Ranking
              </IonCardTitle>
              <IonList lines="full">
                  <IonItem>
                      <IonLabel slot="start">Category 1</IonLabel>
                      <IonLabel slot="end">0.78455</IonLabel>
                  </IonItem>
                  <IonItem>
                      <IonLabel>Category 2</IonLabel>
                      <IonLabel slot="end">0.74855</IonLabel>
                  </IonItem>
                  <IonItem>
                      <IonLabel>Category 3</IonLabel>
                      <IonLabel slot="end">0.53470</IonLabel>
                  </IonItem>
                  <IonItem lines="none">
                      <IonLabel>Category 4</IonLabel>
                      <IonLabel slot="end">0.29475</IonLabel>
                  </IonItem>
              </IonList>
          </IonCardContent>
      </IonCard>
  );
}

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
                <Ranking />
            </IonContent>
        </IonPage>
    );
}
