import React from "react";
import { useEffect, useState } from "react";
import Answer from "../answer/Answer";
import {quizService} from "../../services/quiz-service";
import {
    IonAlert,
    IonButton, IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonContent,
    IonList,
    IonLoading,
    IonPage,
    IonRadioGroup,
} from "@ionic/react";
import {PageHeader} from "../common/PageHeader";
import {QuestionsSetRequest, TeacherQuestionRequest} from "../../types/my-quiz";
import {useQuizzContext} from "../../context/QuizzContext"

const PAGE_NAME = "Quiz";

export const Quiz: React.FC = () => {
    const [isCorrectKey, setIsCorrectKey] = useState<boolean>(true);
    const [showResult, setShowResult] = useState(false);
    const [selected, setSelected] = useState<string | undefined>(undefined);
    const [quiz, setQuiz] = useState<QuestionsSetRequest | undefined>(undefined);
    const [question, setQuestion] = useState<TeacherQuestionRequest | undefined>(undefined);
    const [questionNumber, setQuestionNumber] = useState(1);
    const [numberOfQuestions, setNumberOfQuestions] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [showLoading, setShowLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [buttonName, setButtonName] = useState<string>('Next')
    const [showQuestionNumber,setShowQuestionNumber] = useState<string>(`Question ${questionNumber} of ${numberOfQuestions}`);
    const { chosenKey } = useQuizzContext();
    
    useEffect(() => {
        setShowLoading(true);
        getQuiz().finally(() => setShowLoading(false));
    }, []);

    const getQuiz = () => {
        return quizService.get(chosenKey)
            .then(res => {
                console.log(`Chosen key: ${chosenKey}`);
                console.log(`Downloaded quiz: ${res.questionsSetName}`);
                setSelected(undefined);
                setQuiz(res);
                setQuestion(res.teacherQuestionsRequest[0]);
                setShowResult(false);
                setNumberOfQuestions(res.teacherQuestionsRequest.length);
                setShowQuestionNumber(`Question ${questionNumber} of ${res.teacherQuestionsRequest.length}`);
            })
            .catch(err => {
                console.log(err);
                setIsCorrectKey(false);
            });
    }

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
        setQuestionNumber(prev => prev+1);
        setQuestion(quiz?.teacherQuestionsRequest[questionNumber])
    }

    const checkAnswer = () => {
        if (questionNumber<numberOfQuestions)
            setShowQuestionNumber(`Question ${questionNumber+1} of ${numberOfQuestions}`)
        else
            setShowQuestionNumber('');
        if(questionNumber<=numberOfQuestions){
            selected === question?.correct ?   setCorrectAnswers(prev => prev+1) : setCorrectAnswers(prev => prev);
            setShowResult(true);
            setTimeout(getNextQuestion, 1500); 
        }

        };

    return(
        <IonPage>
            <PageHeader name={ PAGE_NAME } />
            <IonContent className="ion-padding">
                <IonLoading
                    isOpen={ showLoading }
                    message={ 'Loading...' }
                />

                {
                    !isCorrectKey ? <IonCard>ERROR</IonCard> :
                        <>
                            <IonCard>
                                <IonCardHeader>
                                    <IonCardSubtitle>
                                        { `Quiz: ${!!quiz ? quiz.questionsSetName : ''}` }
                                    </IonCardSubtitle>
                                    <IonCardTitle>
                                        { showQuestionNumber }
                                    </IonCardTitle>
                                </IonCardHeader>
                                <IonCardContent style={{ textAlign: "justify" }}>
                                    { question?.question }
                                </IonCardContent>
                            </IonCard>

                            <IonList>
                                <IonRadioGroup value={ selected } onIonChange={e => setSelected(e.detail.value)}>
                                    { answerItems }
                                </IonRadioGroup>
                            </IonList>

                            <IonButton
                                onClick={ () => {
                                    checkAnswer();
                                    if(questionNumber >= numberOfQuestions) {
                                        setShowAlert(true)
                                    }
                                    else if(questionNumber >= numberOfQuestions-1) {
                                        setButtonName("Show result");
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
                        </>
                }
        </IonContent>
        </IonPage>
    )
};
