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
import CategoryStorage from "../services/category-storage";

type CorrectType = {
    id: number,
    name: string
}

type CategoryType = {
    id: number,
    name: string
}

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
    const [selected, setSelected] = useState<string>(null!);
    const [questionNumber, setQuestionNumber] = useState(0);
    const [category, setCategory] = useState<CategoryType>(null!);
    const [question, setQuestion] = useState("");
    const [answers, setAnswers] = useState<string[]>([]);
    const [correct, setCorrect] = useState<CorrectType>(null!);

    const answerItems = answers.map(answer =>
        <Answer name={ answer } />
    );

    const checkAnswer = () => {
        console.log(`${selected === correct.name ? 'CORRECT' : 'NOT CORRECT'}`);

        QuestionService.sendAnswer({
            correctId: correct.id,
            isCorrect: selected === correct.name
        })
            .then(res => {
                if (res.status !== HttpStatusCode.NO_CONTENT) {
                    console.log(res.statusText);
                    return;
                }
            })
            .catch(err => console.log(err));

        getNewQuestion();
    }

    useEffect(() => {
        getNewQuestion();
    }, []);

    const getNewQuestion = () => {
        if (CategoryStorage.isEmpty()) {
            console.log('Category storage is empty');
            return;
        }

        const randomCategory = CategoryStorage.getRandom();
        setCategory(randomCategory);

        QuestionService.get(randomCategory.id)
            .then(res => {
                if (res.status !== HttpStatusCode.OK) {
                    console.log(res.statusText);
                    return;
                }

                console.log(`Correct answer: ${res.data.correct.name}`)

                setQuestion(res.data.question);
                setAnswers(res.data.answers);
                setCorrect(res.data.correct);

                setSelected(null!);
                setQuestionNumber(prev => prev + 1);
            })
            .catch(err => console.log(err));
    }

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
                      { `Category ${!!category ? category.name : ''}` }
                  </IonCardSubtitle>
                  <IonCardTitle>
                      { `Question ${questionNumber || ''}` }
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

          <IonButton
              onClick={ checkAnswer }
              expand="block"
              style={{ marginTop: 20, marginBottom: 30 }}
          >
              Check
          </IonButton>

      </IonContent>
    </IonPage>
  );
};

export default Tab1;
