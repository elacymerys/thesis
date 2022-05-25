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
import { useEffect, useState } from "react";
import QuestionService from "../services/question-service";
import { HttpStatusCode } from "../utils/http-status-code";

const Answer: React.FC<{ name: string }> = props => {
    return (
        <IonItem>
            <IonLabel>
                { props.name }
            </IonLabel>
            <IonRadio slot="start" value={ props.name } />
        </IonItem>
    );
}

const Tab1: React.FC = () => {
    const [selected, setSelected] = useState<number>(null!);
    const [question, setQuestion] = useState("");
    const [answers, setAnswers] = useState<string[]>([]);

    const answerItems = answers.map(answer =>
        <Answer name={ answer } />
    );

    useEffect(() => {
        QuestionService.get(1)
            .then(res => {
                if (res.status !== HttpStatusCode.OK) {
                    return;
                }

                setQuestion(res.data.question);
                setAnswers(res.data.answers);
            })
            .catch(err => console.log(err));
    }, []);

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
                      { "Category" }
                  </IonCardSubtitle>
                  <IonCardTitle>
                      Question X
                  </IonCardTitle>
              </IonCardHeader>

              <IonCardContent style={{ textAlign: "justify" }}>
                  { question.replaceAll('*****', '_____') }
              </IonCardContent>
          </IonCard>

          <IonList>
              <IonRadioGroup value={ selected } onIonChange={e => setSelected(e.detail.value)}>
                  { answerItems }
              </IonRadioGroup>
          </IonList>

          <IonButton expand="block" style={{ marginTop: 20, marginBottom: 30 }}>Check</IonButton>

      </IonContent>
    </IonPage>
  );
};

export default Tab1;
