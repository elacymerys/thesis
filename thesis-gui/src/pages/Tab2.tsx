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
import React ,
    {useState,
    useEffect,}
    from "react";

import {getCategoriesList} from "./categoriesApi";
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

// const getCategoriesList = async () => {
//     axios.get<Category[]>('http://127.0.0.1:8000/api/categories')
//     .then((response: AxiosResponse) => {
//         return response.data
//     });
// }

const Tab2: React.FC = () => {

    const [categories, setCategories] = useState<Category[]>([])

    useEffect(() => {
        const fetchCategories= async() =>{
            const categoriesList = await getCategoriesList();
            setCategories(categoriesList);
        }
        fetchCategories();
    }, [])
    const categoryRows = categories.map(category =>
    <Category name={ category.name } />);
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
                        { categoryRows }
                    </IonRadioGroup>
                </IonList>
                <IonButton expand="block">Choose</IonButton>

            </IonContent>
        </IonPage>
    );
};

export default Tab2;
