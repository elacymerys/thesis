import React, {useEffect, useState} from "react";
import {IonButton, IonContent, IonInput, IonItem, IonLoading, IonPage} from "@ionic/react";
import {PageHeader} from "../common/PageHeader";
import {useCategoryContext} from "../../context/CategoryContext";
import {useHistory} from "react-router";

const PAGE_NAME = "Private Quiz";

export const PrivateQuizEntrance: React.FC = () => {
    const { loadingState } = useCategoryContext();
    const history = useHistory();

    const [input, setInput] = useState<string>('');
    const [disableQuiz, setDisableQuiz] = useState<boolean>(true);

    const handleCodeLength = (code: string) => setDisableQuiz(code.length != 8);

    useEffect(() => {
        if (loadingState === 'FAILURE') {
            history.push('/error-page');
        }
    }, [loadingState, history])

    return (
        <IonPage>
            <PageHeader name={ PAGE_NAME } />
            <IonContent class="ion-padding">
                <IonLoading isOpen={loadingState === 'LOADING'}/>

                <IonItem>
                    <IonInput
                        value={input}
                        onIonChange={(e: any) => {
                            setInput(e.target.value);
                            handleCodeLength(e.target.value);
                        }}
                        placeholder="Enter quiz secret key"
                    ></IonInput>
                </IonItem>
                <IonButton
                    routerLink={`/quiz/${input}`}
                    routerDirection="back"
                    expand="block"
                    disabled={disableQuiz}
                    style={{ marginTop: 20, marginBottom: 30 }}
                >
                    Start
                </IonButton>
            </IonContent>
        </IonPage>
    );
}
