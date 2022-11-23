import React from "react";
import {
    IonAvatar, IonButton,
    IonCard, IonCardContent, IonCardSubtitle, IonCardTitle,
    IonContent,
    IonItem, IonLabel, IonList,
    IonPage, IonRouterLink
} from "@ionic/react";
import {useUserContext} from "../../context/UserContext";
import {useCategoryContext} from "../../context/CategoryContext";
import {PageHeader} from "../common/PageHeader";

const PAGE_NAME = "My Account";

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

const CategoryRanksItem: React.FC<{ name: string, rank: number }> = ({ name, rank }) => {
    return (
        <IonItem>
            <IonLabel>{ name }</IonLabel>
            <IonLabel slot="end">
                { rank }
            </IonLabel>
        </IonItem>
    );
}

const Ranking = () => {
    const { user } = useUserContext();
    const { categories } = useCategoryContext();

    const getCategoryNameWithId = (id: number) => {
        for (let category of categories) {
            if (category.id === id) {
                return category.name;
            }
        }
        return '';
    }

    const categoryRanksItems = Object.entries(user!.categoryRanks).filter(([_, rank]) => rank > 0).map(([id, rank]) => {
        return <CategoryRanksItem
            name={ getCategoryNameWithId(parseInt(id)) }
            rank={ rank }
        />
    });

    return (
      <IonCard>
          <IonCardContent>
              <IonCardTitle style={{ textAlign: "center" }}>
                  My Ranking
              </IonCardTitle>
              {
                  categoryRanksItems.length > 0 ?
                      <IonList lines="full">
                          { categoryRanksItems }
                      </IonList> :
                      <>
                          <IonCardSubtitle style={{ textAlign: "center" }}>
                              Play to earn points and climb the leaderboard!
                          </IonCardSubtitle>
                          <IonCardSubtitle style={{ textAlign: "center" }}>
                              Click <IonRouterLink routerLink="/categories">here</IonRouterLink> to start the game
                          </IonCardSubtitle>
                      </>
              }
          </IonCardContent>
      </IonCard>
  );
}

export const MyAccount: React.FC = () => {
    return (
        <IonPage>
            <PageHeader name={ PAGE_NAME } />
            <IonContent className="ion-padding">
                <UserInfo />
                <Ranking />
            </IonContent>
        </IonPage>
    );
}
