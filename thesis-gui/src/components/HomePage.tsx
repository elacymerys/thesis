import React from "react";
import {
    IonCard, IonCardContent, IonCardSubtitle, IonCardTitle,
    IonContent,
    IonPage,
    IonRouterLink, IonText
} from "@ionic/react";
import {PageHeader} from "./common/PageHeader";

const PAGE_NAME = 'Play';

export const HomePage: React.FC = () => {
    return (
        <IonPage>
            <PageHeader name={ PAGE_NAME } />
            <IonContent class="ion-padding">
                <IonText style={{ display: "block", textAlign: "center", marginBottom: "15px" }}>
                    <h4>Choose quiz type ...</h4>
                </IonText>

                <IonCard>
                    <IonCardContent>
                        <IonCardTitle style={{ textAlign: "center" }}>
                            Ranked Quiz
                        </IonCardTitle>
                        <IonCardSubtitle style={{ textAlign: "center" }}>
                            Play to earn points and climb the leaderboard!
                        </IonCardSubtitle>
                        <IonCardSubtitle style={{ textAlign: "center" }}>
                            Click <IonRouterLink routerLink="/categories">here</IonRouterLink> to start the game
                        </IonCardSubtitle>
                    </IonCardContent>
                </IonCard>

                <IonText style={{ display: "block", textAlign: "center", marginBottom: "15px" }}>
                    <h4>or</h4>
                </IonText>

                <IonCard>
                    <IonCardContent>
                        <IonCardTitle style={{ textAlign: "center" }}>
                            Private Quiz
                        </IonCardTitle>
                        <IonCardSubtitle style={{ textAlign: "center" }}>
                            Only for the chosen ones! You need a secret key
                        </IonCardSubtitle>
                        <IonCardSubtitle style={{ textAlign: "center" }}>
                            Click <IonRouterLink routerLink="/private-quiz">here</IonRouterLink> to start the game
                        </IonCardSubtitle>
                    </IonCardContent>
                </IonCard>
            </IonContent>
        </IonPage>
    );
};
