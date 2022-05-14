import {
    IonButton,
    IonCheckbox,
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonPage, IonRadioGroup,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import './Tab2.css';
import React from "react";

const mockCategories = [
    "Category 1",
    "Category 2",
    "Category 3",
    "Category 4",
    "Category 5",
    "Category 6",
    "Category 7",
];

type Category = {
    name: string;
};

const Category: React.FC<Category> = props => {
    return (
        <IonItem>
            <IonLabel>
                { props.name }
            </IonLabel>
            <IonCheckbox slot="start" />
        </IonItem>
    );
}

const categoryItems = mockCategories.map(category =>
    <Category name={ category } />
);

const Tab2: React.FC = () => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Tab 2</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Tab 2</IonTitle>
                    </IonToolbar>
                </IonHeader>

                <IonList>
                    <IonRadioGroup>
                        <IonListHeader>
                            <IonLabel>Categories</IonLabel>
                        </IonListHeader>

                        { categoryItems }
                    </IonRadioGroup>
                </IonList>

                <IonButton expand="block">Choose</IonButton>
            </IonContent>
        </IonPage>
    );
};

export default Tab2;
