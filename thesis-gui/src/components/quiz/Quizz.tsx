import React from "react";
import { useEffect, useState } from "react";
import Answer from "../answer/Answer";
import {quizzService} from "../../services/quizz-service";
import {
    IonAlert,
    IonButton,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonContent,

    IonList,
    IonLoading,
    IonPage,
    IonRadioGroup
} from "@ionic/react";
import {PageHeader} from "../common/PageHeader";
import { TeacherQuestionSet } from "../../types/teacher-question-set";
import { TeacherQuestion } from "../../types/teacher-question";
import {useQuizzContext} from "../../context/QuizzContext"

const PAGE_NAME = "Quizz";

export const Quizz: React.FC = () => {
    const [showResult, setShowResult] = useState(false);
    const [selected, setSelected] = useState<string | undefined>(undefined);
    const [quizz, setQuizz] = useState<TeacherQuestionSet | undefined>(undefined);
    const [question, setQuestion] = useState<TeacherQuestion | undefined>(undefined);
    const [questionNumber, setQuestionNumber] = useState(1);
    const [numberOfQuestions, setNumberOfQuestions] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [showLoading, setShowLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [buttonName, setButtonName] = useState<string>('Next')
    const { chosenKey } = useQuizzContext();


    
    useEffect(() => {
        setShowLoading(true);
        getQuizz().finally(() => setShowLoading(false)
);
    }, []);

    const answerItems = question && question.answers.map(answer =>
        <Answer
            name={ answer }
            showCorrect={ showResult && answer === question.correct }
            showWrong={ showResult && answer === selected && answer !== question.correct }
            key={ answer }
        />
    );
    const getNextQuestion = () => {
        setShowResult(false);
        if (questionNumber<numberOfQuestions){
            setQuestionNumber(prev => prev+1);
        }
        setQuestion(quizz?.teacherQuestionsResponse[questionNumber])
    }

    const checkAnswer = () => {
        if(questionNumber<=numberOfQuestions){
            selected === question?.correct ?   setCorrectAnswers(prev => prev+1) : setCorrectAnswers(prev => prev);
            setShowResult(true);
            setTimeout(getNextQuestion, 1500); 
        }

        };

    const getQuizz = async () => {
        return await quizzService.get(chosenKey)
        .then(res => {
            console.log(`Downloaded quizz: ${res.questionsSetName}`)
            setSelected(undefined);
            setQuizz(res);
            setQuestion(res.teacherQuestionsResponse[0]);
            setShowResult(false);
            setNumberOfQuestions(res.teacherQuestionsResponse.length);
        }
        )
        .catch(err =>
        {
        console.log(err);
        });
    }
    return(
    <IonPage>
        <PageHeader name={ PAGE_NAME } condense={ false } />
        <IonContent className="ion-padding">
            <IonLoading
                isOpen={ showLoading }
                message={ 'Loading...' }
            />
            <PageHeader name={ PAGE_NAME } condense={ true } />
            <IonCardHeader>
                <IonCardSubtitle>
                    { `Quiz: ${!!quizz ? quizz.questionsSetName : ''}` }
                </IonCardSubtitle>
                <IonCardTitle>
                    { `Question ${questionNumber} of ${numberOfQuestions}` }
                </IonCardTitle>
            </IonCardHeader>
            <IonCardContent style={{ textAlign: "justify" }}>
                { question?.question }
            </IonCardContent>
            <IonList>
                    <IonRadioGroup value={ selected } onIonChange={e => setSelected(e.detail.value)}>
                        { answerItems }
                    </IonRadioGroup>
                </IonList>

                <IonButton
                    onClick={ () => {
                        checkAnswer();
                        if(questionNumber >= numberOfQuestions-1) {
                        setButtonName("Show result")
                        }
                        if(questionNumber >= numberOfQuestions) {
                            setShowAlert(true)
                        }  
                        }
                    }
                    disabled={ showResult }
                    expand="block"
                    style={{ marginTop: 20, marginBottom: 30 }}
                >
                    {buttonName}
                </IonButton>
                <IonAlert
                    isOpen={showAlert}
                    onDidDismiss={() => 
                        setShowAlert(false)
                    }
                    header="You finished the test"
                    subHeader="this is your result"
                    message={`${correctAnswers} / ${numberOfQuestions}`}
                    buttons={['OK']}
                />
        </IonContent>
    </IonPage>
    )
};
