import React, {useEffect, useState} from "react";
import {IonButton, IonContent, IonInput, IonItem, IonLoading, IonPage} from "@ionic/react";
import {PageHeader} from "../common/PageHeader";
import {useCategoryContext} from "../../context/CategoryContext";
import {useHistory} from "react-router";

const PAGE_NAME = "Private Quiz";

export const PrivateQuizEntrance: React.FC = () => {
    const { loadingState } = useCategoryContext();
    const history = useHistory();

    const [key, setKey] = useState<string>('');

    useEffect(() => {
        if (loadingState === 'FAILURE') {
            history.push('/error-page');
        }
    }, [loadingState, history]);

    return (
        <IonPage>
            <PageHeader name={ PAGE_NAME } />
            <IonContent class="ion-padding">
                <IonLoading isOpen={loadingState === 'LOADING'}/>

                <IonItem>
                    <IonInput
                        value={key}
                        onIonChange={(e: any) => setKey(e.target.value)}
                        placeholder="Enter quiz secret key"
                        autofocus
                    ></IonInput>
                </IonItem>
                <IonButton
                    routerLink={`/quiz/${key}`}
                    routerDirection="back"
                    expand="block"
                    disabled={ key.length != 8 }
                    style={{ marginTop: 20, marginBottom: 30 }}
                >
                    Start
                </IonButton>
            </IonContent>
        </IonPage>
    );
}
