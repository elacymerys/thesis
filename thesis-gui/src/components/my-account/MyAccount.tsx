import React, {useEffect, useState} from "react";
import {
    IonAvatar, IonButton,
    IonCard, IonCardContent, IonCardSubtitle, IonCardTitle,
    IonContent,
    IonHeader, IonItem, IonLabel, IonList,
    IonPage,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import {userService} from "../../services/user-service";
import {useUserContext} from "../../context/UserContext";

const UserInfo: React.FC = () => {
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
    const [nick, setNick] = useState<string>('');
    const [email, setEmail] = useState<string>('');

    useEffect(() => {
        userService.getUser()
            .then(res => {
                setNick(res.nick);
                setEmail(res.email);
            });
    }, []);

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
