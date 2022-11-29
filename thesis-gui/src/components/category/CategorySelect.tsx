import React, {useEffect} from "react";
import {useCategoryContext} from "../../context/CategoryContext";
import {useHistory} from "react-router";
import {
    IonButton,
    IonContent,
    IonList,
    IonLoading,
    IonPage,
    IonRadioGroup
} from "@ionic/react";
import {CategoryCheckbox} from "./CategoryCheckbox";
import {PageHeader} from "../common/PageHeader";

export const CategorySelect: React.FC = () => {
    const { loadingState, categories, chosenCategories } = useCategoryContext();
    const history = useHistory();

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
            <PageHeader name="Categories" condense={ false } />
            <IonContent class="ion-padding">
                <PageHeader name="Categories" condense={ true } />
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
                    disabled={ !chosenCategories.length }
                >
                    Choose
                </IonButton>
            </IonContent>
        </IonPage>
    );
};
