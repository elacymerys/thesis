import React from "react";
import {IonCheckbox, IonItem, IonLabel} from "@ionic/react";
import {Category} from "../../types/category";
import {useCategoryContext} from "../../context/CategoryContext";

export const CategoryCheckbox: React.FC<{
    category: Category
}> = ({
    category
}) => {
    const { chosenCategories, chooseCategories } = useCategoryContext();

    const addCategory = () => chooseCategories([...chosenCategories, category]);
    const removeCategory = () => chooseCategories(chosenCategories.filter(chosenCategory => chosenCategory !== category));

    return (
        <IonItem>
            <IonLabel>
                { category.name }
            </IonLabel>
            <IonCheckbox
                checked={chosenCategories.includes(category)}
                onIonChange={e => e.detail.checked ? addCategory() : removeCategory()}
                slot="start"
            />
        </IonItem>
    );
}
