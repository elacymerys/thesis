import {
    IonButton,
    IonContent,
    IonHeader,
    IonLabel,
    IonList,
    IonListHeader, IonLoading,
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
import { CategoryType } from "../types/category-type";
import Category from "../components/category/Category";


const Tab2: React.FC = () => {
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [showLoading, setShowLoading] = useState(false);
    const history = useHistory();

    const chooseCategories = () => {
        if (CategoryStorage.isEmpty()) {
            console.log('You have to choose at least one category!');
            return;
        }

        history.push('/questions');
    }

    useEffect(() => {
        setShowLoading(true);

        CategoryService.getAll()
            .then(res => {
                if (res.status !== HttpStatusCode.OK) {
                    console.log(res.statusText);
                    return;
                }

                setCategories(res.data);
            })
            .catch(err => console.log(err))
            .finally(() => setShowLoading(false));
    }, []);

    const categoryItems = categories.map(category =>
        <Category id={ category.id } name={ category.name } />);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Categories</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Categories</IonTitle>
                    </IonToolbar>
                </IonHeader>

                <IonLoading
                    isOpen={ showLoading }
                    message={ 'Loading...' }
                />

                <IonList>
                    <IonRadioGroup>
                        <IonListHeader>
                            <IonLabel>Categories</IonLabel>
                        </IonListHeader>
                        { categoryItems }
                    </IonRadioGroup>
                </IonList>
                <IonButton
                    onClick={ chooseCategories }
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
