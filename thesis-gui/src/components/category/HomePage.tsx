import React, {useEffect, useState} from "react";
import {useCategoryContext} from "../../context/CategoryContext";
import {useQuizzContext} from "../../context/QuizzContext";

import {useHistory} from "react-router";
import {
    IonButton,
    IonContent,
    IonInput,
    IonItem,
    IonList,
    IonLoading,
    IonPage,
    IonRadioGroup,
    IonText
} from "@ionic/react";
import {CategoryCheckbox} from "./CategoryCheckbox";
import {PageHeader} from "../common/PageHeader";

export const HomePage: React.FC = () => {
    const { loadingState, categories } = useCategoryContext();
    const { chooseKey } = useQuizzContext();
    const history = useHistory();
    const [input, setInput] = useState<string>('');
    const [disableQuizz, setDisableQuizz] = useState<boolean>(true);
    const handleCodeLength = (code: string) => {
        if(code.length != 8)
            setDisableQuizz(true);
        else
            setDisableQuizz(false);

    };


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
            <PageHeader name="Home Page" condense={ false } />
            <IonContent class="ion-padding">
                <PageHeader name="Home Page" condense={ true } />
                <IonLoading isOpen={loadingState === 'LOADING'}/>
                <IonText color="primary">
                    <h1>Private Quiz</h1>
                </IonText>
                <IonItem>
                    <IonInput 
                    value={input}
                    onIonChange={(e:any) => {
                        setInput(e.target.value);
                        chooseKey(e.target.value);
                        handleCodeLength(e.target.value);
                    }}
                    placeholder="Enter code of the Quiz"
                    ></IonInput>
                </IonItem>
                <IonButton
                    routerLink={"/quizz"}
                    routerDirection="back"
                    expand="block"
                    disabled={disableQuizz}
                    style={{ marginTop: 20, marginBottom: 30 }}
                >
                    Start
                </IonButton>
                
                <IonText color="primary">
                    <h1>Categories</h1>
                </IonText>
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
