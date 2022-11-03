import React from "react";
import {
    IonButton,
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonList,
    IonPage,
    IonTitle,
    IonToolbar
} from "@ionic/react";

const QuizzesList = () => {
  return (
      <IonList lines="full">
          <IonItem button detail={true}>
              <IonLabel>
                  <h2>Quiz 1</h2>
                  <p>x questions</p>
              </IonLabel>
          </IonItem>
          <IonItem button detail={true}>
              <IonLabel>
                  <h2>Quiz 2</h2>
                  <p>x questions</p>
              </IonLabel>
          </IonItem>
          <IonItem button detail={true}>
              <IonLabel>
                  <h2>Quiz 3</h2>
                  <p>x questions</p>
              </IonLabel>
          </IonItem>
          <IonItem button detail={true}>
              <IonLabel>
                  <h2>Quiz 4</h2>
                  <p>x questions</p>
              </IonLabel>
          </IonItem>
      </IonList>
  );
}

const MyQuizzes: React.FC = () => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar style={{ textAlign: "center" }}>
                    <IonTitle>My Quizzes</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonHeader collapse="condense">
                    <IonToolbar style={{ textAlign: "center" }}>
                        <IonTitle>My Quizzes</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonButton expand="block">
                    Create new quiz
                </IonButton>
                <QuizzesList />
            </IonContent>
        </IonPage>
    );
}

export default MyQuizzes;
