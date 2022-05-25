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
    IonToolbar,
} from '@ionic/react';
import './Tab2.css';
import React, {
    useState,
    useEffect
} from "react";
import CategoryService from "../services/category-service";
import {HttpStatusCode} from "../utils/http-status-code";

type Category = {
    id: number,
    name: string
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

const Tab2: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        CategoryService.getAll()
            .then(res => {
                if (res.status !== HttpStatusCode.OK) {
                    console.log(res.statusText);
                    return;
                }

                setCategories(res.data.categories);
            })
            .catch(err => console.log(err));
    }, []);

    const categoryItems = categories.map(category =>
        <Category id={ category.id } name={ category.name } />);

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
