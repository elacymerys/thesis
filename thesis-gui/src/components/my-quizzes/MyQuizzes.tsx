import React from "react";
import {
    IonButton,
    IonContent,
    IonItem,
    IonLabel,
    IonList,
    IonPage
} from "@ionic/react";
import {PageHeader} from "../common/PageHeader";

const PAGE_NAME = "My Quizzes";

const QUIZZES = [
    {
        name: "Quiz 1",
        questionsNumber: 5
    },
    {
        name: "Quiz 2",
        questionsNumber: 27
    },
    {
        name: "Quiz 3",
        questionsNumber: 8
    },
    {
        name: "Quiz 4",
        questionsNumber: 13
    }
];

const QuizzesListItem: React.FC<{
    name: string,
    questionsNumber: number
}> = ({ name, questionsNumber }) => {
    return (
        <IonItem button detail={true}>
            <IonLabel>
                <h2>{ name }</h2>
                <p>{ `${questionsNumber} question(s)` }</p>
            </IonLabel>
        </IonItem>
    );
}

const QuizzesList: React.FC = () => {
    const quizzesListItems = QUIZZES.map(quiz => {
        return <QuizzesListItem name={ quiz.name } questionsNumber={ quiz.questionsNumber } />
    });

    return (
      <IonList lines="full" style={{ paddingTop: "15px" }}>
          { quizzesListItems }
      </IonList>
  );
}

export const MyQuizzes: React.FC = () => {
    return (
        <IonPage>
            <PageHeader name={ PAGE_NAME } condense={ false } />
            <IonContent className="ion-padding">
                <PageHeader name={ PAGE_NAME } condense={ true } />
                <IonButton expand="block">
                    Create new quiz
                </IonButton>
                <QuizzesList />
            </IonContent>
        </IonPage>
    );
}
