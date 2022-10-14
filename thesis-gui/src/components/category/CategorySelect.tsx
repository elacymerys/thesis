import React, {useEffect} from "react";
import {useCategoryContext} from "../../context/CategoryContext";
import {useHistory} from "react-router";
import {
    IonButton,
    IonContent,
    IonList,
    IonLoading,
    IonPage,
    IonRadioGroup,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import {CategoryCheckbox} from "./CategoryCheckbox";
import {PageHeader} from "../common/PageHeader";

export const CategorySelect: React.FC = () => {
    const { loadingState, categories, getCategories } = useCategoryContext();
    const history = useHistory();

    useEffect(() => {
        if (categories.length === 0) {
            getCategories();
        }
    }, []);

    useEffect(() => {
        if (loadingState === 'FAILURE') {
            history.push('/error-page');
        }
    }, [loadingState, history])

    const categoryItems = categories.map(category =>
        <CategoryCheckbox category={category} key={category.name}/>
    );

    return (
        <IonPage>
            <PageHeader/>
            <IonContent class="ion-padding">
                <IonToolbar>
                    <IonTitle>Categories</IonTitle>
                </IonToolbar>

                <IonLoading isOpen={loadingState === 'LOADING'}/>

                <IonList>
                    <IonRadioGroup>
                        { categoryItems }
                    </IonRadioGroup>
                </IonList>
                <IonButton
                    routerLink="/questions"
                    routerDirection="back"
                    expand="block"
                    style={{ marginTop: 20, marginBottom: 30 }}
                >
                    Choose
                </IonButton>
            </IonContent>
        </IonPage>
    );
};
