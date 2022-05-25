import {
    IonButton,
    IonCard, IonCardContent,
    IonCardHeader,
    IonCardSubtitle, IonCardTitle,
    IonContent,
    IonHeader, IonItem, IonLabel, IonList,
    IonPage, IonRadio, IonRadioGroup,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import './Tab1.css';
import { useState } from "react";

const mockData = {
    category: "Category",
    question: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore " +
        "et dolore magna aliqua. Libero nunc consequat.",
    answers: [
        {
            id: 1,
            name: "Answer 1",
            correct: true
        },
        {
            id: 2,
            name: "Answer 2",
            correct: false
        },
        {
            id: 3,
            name: "Answer 3",
            correct: false
        },
        {
            id: 4,
            name: "Answer 4",
            correct: false
        }
    ]
};

type AnswerType = {
    id: number,
    name: string,
    correct: boolean
}

const Answer: React.FC<{ answer: AnswerType }> = props => {
    return (
        <IonItem>
            <IonLabel>
                { props.answer.name }
            </IonLabel>
            <IonRadio slot="start" value={ props.answer.id } />
        </IonItem>
    );
}

const answerItems = mockData.answers.map(answer =>
    <Answer answer={ answer } />
);

const Tab1: React.FC = () => {
  const [selected, setSelected] = useState<number>(null!);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 1</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 1</IonTitle>
          </IonToolbar>
        </IonHeader>

          <IonCard>
              <IonCardHeader>
                  <IonCardSubtitle>
                      { mockData.category }
                  </IonCardSubtitle>
                  <IonCardTitle>
                      Question X
                  </IonCardTitle>
              </IonCardHeader>

              <IonCardContent style={{ textAlign: "justify" }}>
                  { mockData.question }
              </IonCardContent>
          </IonCard>

          <IonList>
              <IonRadioGroup value={ selected } onIonChange={e => setSelected(e.detail.value)}>
                  { answerItems }
              </IonRadioGroup>
          </IonList>

          <IonButton expand="block">Check</IonButton>

      </IonContent>
    </IonPage>
  );
};

export default Tab1;
