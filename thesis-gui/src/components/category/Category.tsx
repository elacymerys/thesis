import React from "react";
import { CategoryType } from "../../types/category-type";
import { IonCheckbox, IonItem, IonLabel } from "@ionic/react";
import CategoryStorage from "../../services/category-storage";

const Category: React.FC<CategoryType> = props => {
    return (
        <IonItem>
            <IonLabel>
                { props.name }
            </IonLabel>
            <IonCheckbox
                onIonChange={ e =>
                    e.detail.checked ? CategoryStorage.add(props.id, props.name) : CategoryStorage.remove(props.id)
                }
                slot="start"
            />
        </IonItem>
    );
}

export default Category;
