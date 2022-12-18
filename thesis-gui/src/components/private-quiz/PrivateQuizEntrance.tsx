import React, {useState} from "react";
import {IonButton, IonContent, IonInput, IonItem, IonPage} from "@ionic/react";
import {PageHeader} from "../common/PageHeader";

const PAGE_NAME = "Private Quiz";

export const PrivateQuizEntrance: React.FC = () => {
    const [key, setKey] = useState<string>('');

    return (
        <IonPage>
            <PageHeader name={ PAGE_NAME } />
            <IonContent class="ion-padding">
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
