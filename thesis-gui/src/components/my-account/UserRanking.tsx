import React from "react";
import {
    IonCard,
    IonCardContent,
    IonCardSubtitle,
    IonCardTitle,
    IonItem,
    IonLabel,
    IonList,
    IonRouterLink
} from "@ionic/react";
import {useUserContext} from "../../context/UserContext";
import {useCategoryContext} from "../../context/CategoryContext";

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

export const UserRanking = () => {
    const { user } = useUserContext();
    const { categories } = useCategoryContext();

    const getCategoryNameWithId = (id: number) => {
        return categories.find(category => category.id == id)?.name || '';
    }

    const categoryRanksItems = Object.entries(user!.categoryRanks)
        .filter(([id, _]) => user!.categoryTotalAnswersCounter[parseInt(id)] > 0)
        .map(([id, rank]) => (
            <CategoryRanksItem
                name={ getCategoryNameWithId(parseInt(id)) }
                rank={ rank }
            />
        )
    );

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