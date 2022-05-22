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
import React, {useEffect, useState} from "react";
import {Question} from "../common/types";
import {getQuestion} from "./categoriesApi";
type Answer = {
    name: string;
};
const Answer: React.FC<Answer> = props => {
    console.log(props.name)
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

  const [question, setQuestion] = useState<Question | null>(null)
    useEffect(() => {
        const fetchQuestion= async() =>{
            try {
                const response = await getQuestion();
                setQuestion(response);
            } catch(e) {
                console.log(e);
            }
        }
        fetchQuestion();
    }, [])
    const answers = question?.answers.map(answer =>
        <Answer name={ answer } />
    );
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
                  </IonCardSubtitle>
                  <IonCardTitle>
                      Question X
                  </IonCardTitle>
              </IonCardHeader>

              <IonCardContent style={{ textAlign: "justify" }}>
                  { question?.question }
              </IonCardContent>
          </IonCard>

          <IonList>
              <IonRadioGroup value={ selected } onIonChange={e => setSelected(e.detail.value)}>
                  { answers }
              </IonRadioGroup>
          </IonList>

          <IonButton expand="block">Check</IonButton>

      </IonContent>
    </IonPage>
  );
};

export default Tab1;
