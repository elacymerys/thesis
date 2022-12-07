import React from "react";
import {
    IonButton,
    IonCol,
    IonContent, IonGrid,
    IonIcon,
    IonInput,
    IonItem,
    IonList,
    IonPage, IonRadio, IonRadioGroup, IonRow,
    IonTextarea,
    IonTitle
} from "@ionic/react";
import {PageHeader} from "../common/PageHeader";
import {arrowBackOutline, arrowForwardOutline} from "ionicons/icons";

const PAGE_NAME = "Quiz Creator";

const AnswerInputItem: React.FC<{ answerNumber: number }> = ({ answerNumber }) => {
    return (
        <IonItem>
            <IonInput placeholder={ `Enter answer ${answerNumber}` }></IonInput>
            <IonRadio slot="end"></IonRadio>
        </IonItem>
    );
}

const AnswersInput: React.FC = () => {
    const answerInputItems = Array.from({ length: 4 }, (_, i) => i + 1).map(answerNumber => {
        return <AnswerInputItem answerNumber={ answerNumber } />
    });

    return (
        <IonList>
            <IonRadioGroup>
                { answerInputItems }
            </IonRadioGroup>
        </IonList>
    );
}

const QuestionInput: React.FC = () => {
    return (
        <>
            <IonTitle style={{ paddingTop: "30px", paddingLeft: "15px" }}>Question X</IonTitle>
            <IonItem>
                <IonTextarea
                    autoGrow={ true }
                    placeholder="Enter text of the question you'd like to ask! Below enter 4 possible answers and check the correct one"
                ></IonTextarea>
            </IonItem>
            <AnswersInput />
        </>
    );
}

const NavigationButtons: React.FC = () => {
    return (
        <IonGrid>
            <IonRow>
                <IonCol style={{ margin: 0,  padding: 0 }}>
                    <IonButton expand="full" fill="clear" style={{ marginRight: 0, paddingRight: 0, borderRight: "solid" }}>
                        Prev
                        <IonIcon slot="start" icon={arrowBackOutline}></IonIcon>
                    </IonButton>
                </IonCol>
                <IonCol style={{ margin: 0,  padding: 0 }}>
                    <IonButton expand="full" fill="clear" style={{ marginLeft: 0, paddingLeft: 0 }}>
                        Next
                        <IonIcon slot="end" icon={arrowForwardOutline}></IonIcon>
                    </IonButton>
                </IonCol>
            </IonRow>
        </IonGrid>
    );
}

export const QuizCreator: React.FC = () => {
    return (
        <IonPage>
            <PageHeader name={ PAGE_NAME } />
            <IonContent className="ion-padding">
                <IonButton expand="block">Save Quiz</IonButton>
                <QuestionInput />
                <NavigationButtons />
            </IonContent>
        </IonPage>
    );
}
