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
import { HttpStatusCode } from "../utils/http-status-code";
import CategoryStorage from "../services/category-storage";
import { useHistory } from "react-router";

type CategoryType = {
    id: number,
    name: string
};

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

const Tab2: React.FC = () => {
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const history = useHistory();

    const chooseCategories = () => {
        if (CategoryStorage.isEmpty()) {
            console.log('You have to choose at least one category!');
            return;
        }

        history.push('/questions');
    }

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
                <IonButton
                    onClick={chooseCategories}
                    expand="block"
                    style={{ marginTop: 20, marginBottom: 30 }}
                >
                    Choose
                </IonButton>

            </IonContent>
        </IonPage>
    );
};

export default Tab2;
