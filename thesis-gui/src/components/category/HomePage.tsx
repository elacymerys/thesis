import React, { useEffect } from "react";
import {
    IonCard, IonCardContent, IonCardSubtitle, IonCardTitle,
    IonContent,
    IonLoading,
    IonPage,
    IonRouterLink
} from "@ionic/react";
import {useHistory} from "react-router";
import {useCategoryContext} from "../../context/CategoryContext";
import {PageHeader} from "../common/PageHeader";

const PAGE_NAME = 'Play';

export const HomePage: React.FC = () => {
    const { loadingState } = useCategoryContext();
    const history = useHistory();

    useEffect(() => {
        if (loadingState === 'FAILURE') {
            history.push('/error-page');
        }
    }, [loadingState, history])

    return (
        <IonPage>
            <PageHeader name={ PAGE_NAME } />
            <IonContent class="ion-padding">
                <IonLoading isOpen={loadingState === 'LOADING'} />

                <IonCard>
                    <IonCardContent>
                        <IonCardTitle style={{ textAlign: "center" }}>
                            Private Quiz
                        </IonCardTitle>
                        <IonCardSubtitle style={{ textAlign: "center" }}>
                            Play to earn points and climb the leaderboard!
                        </IonCardSubtitle>
                        <IonCardSubtitle style={{ textAlign: "center" }}>
                            Click <IonRouterLink routerLink="/private-quiz">here</IonRouterLink> to start the game
                        </IonCardSubtitle>
                    </IonCardContent>
                </IonCard>

                <IonCard>
                    <IonCardContent>
                        <IonCardTitle style={{ textAlign: "center" }}>
                            Categories
                        </IonCardTitle>
                        <IonCardSubtitle style={{ textAlign: "center" }}>
                            Play to earn points and climb the leaderboard!
                        </IonCardSubtitle>
                        <IonCardSubtitle style={{ textAlign: "center" }}>
                            Click <IonRouterLink routerLink="/categories">here</IonRouterLink> to start the game
                        </IonCardSubtitle>
                    </IonCardContent>
                </IonCard>
            </IonContent>
        </IonPage>
    );
};
