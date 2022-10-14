import {
    IonButton,
    IonCard, IonCardContent,
    IonCardHeader,
    IonCardSubtitle, IonCardTitle,
    IonContent,
    IonList, IonLoading,
    IonPage, IonRadioGroup,
} from '@ionic/react';
import React, {FC, useEffect, useState} from "react";
import { HttpStatusCode } from "../../utils/http-status-code";
import {questionService} from "../../services/question-service";
import {ApiError, isApiError} from "../../types/api-error";
import {useUserContext} from "../../context/UserContext";
import {useHistory} from "react-router";
import {useCategoryContext} from "../../context/CategoryContext";
import {Question} from "../../types/question";
import {QuestionAnswer} from "./QuestionAnswer";
import {PageHeader} from "../common/PageHeader";

type CategoryType = {
    id: number,
    name: string
}

export const DefinitionQuestion: FC = () => {
    const { tryRefreshTokens } = useUserContext();
    const { chosenCategories } = useCategoryContext();
    const history = useHistory();

    const [selected, setSelected] = useState<string | undefined>(undefined);
    const [questionNumber, setQuestionNumber] = useState(0);
    const [category, setCategory] = useState<CategoryType | undefined>(undefined);
    const [question, setQuestion] = useState<Question | undefined>();
    const [showLoading, setShowLoading] = useState(false);
    const [showResult, setShowResult] = useState(false);

    useEffect(() => {
        if (chosenCategories.length === 0) {
            history.push('/categories');
            return;
        }
        getNewQuestion(2);
    }, [chosenCategories, history]);

    const answerItems = question && question.answers.map(answer =>
        <QuestionAnswer
            name={ answer }
            showCorrect={ showResult && answer === question.correct.name }
            showWrong={ showResult && answer === selected && answer !== question.correct.name }
            key={answer}
        />
    );

    const checkAnswer = () => {
        setShowResult(true);
        questionService.sendAnswer(question!.correct.id, { answerCorrect: selected === question!.correct.name })
            .then(() => setTimeout(() => getNewQuestion(1), 3000))
            .catch(err => {
                if (isApiError(err) && (err as ApiError).apiStatusCode === HttpStatusCode.UNAUTHORIZED) {
                    tryRefreshTokens().then(checkAnswer);
                } else {
                    console.log(err);
                    history.push('/error-page');
                }
            });
    }

    const getNewQuestion = (d: number) => {
        setShowLoading(true);
        const randomCategory = chosenCategories[Math.floor(Math.random() * chosenCategories.length)]
        questionService.get(randomCategory.id)
            .then(res => {
                setShowLoading(false);
                setShowResult(false);
                setCategory(randomCategory);
                setQuestion(res);
                setSelected(undefined);
                setQuestionNumber(prev => prev + 1);
            })
            .catch(err => {
                if (isApiError(err) && (err as ApiError).apiStatusCode === HttpStatusCode.UNAUTHORIZED) {
                    tryRefreshTokens().then(getNewQuestion);
                } else {
                    console.log(err);
                    history.push('/error-page');
                }
            });
    }

  return (
    <IonPage>
      <PageHeader/>
      <IonContent fullscreen>
        <IonLoading
            isOpen={showLoading}
            message={'Loading...'}
        />
          <IonCard>
              <IonCardHeader>
                  <IonCardSubtitle>
                      { `Category: ${!!category ? category.name : ''}` }
                  </IonCardSubtitle>
                  <IonCardTitle>
                      { `Question ${questionNumber || ''}` }
                  </IonCardTitle>
              </IonCardHeader>

              <IonCardContent style={{ textAlign: "justify" }}>
                  { question && question.question.replaceAll('*****', '_____') }
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
              disabled={showResult}
              style={{ marginTop: 20, marginBottom: 30 }}
          >
              Check
          </IonButton>
      </IonContent>
    </IonPage>
  );
};
