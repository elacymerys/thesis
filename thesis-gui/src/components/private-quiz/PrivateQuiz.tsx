import React from "react";
import { useEffect, useState } from "react";
import Answer from "../answer/Answer";
import {quizService} from "../../services/quiz-service";
import {
    IonButton, IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonContent,
    IonList,
    IonLoading,
    IonPage,
    IonRadioGroup, IonRouterLink,
} from "@ionic/react";
import {PageHeader} from "../common/PageHeader";
import {QuestionsSetResponse, TeacherQuestionResponse} from "../../types/my-quiz";
import {useParams} from "react-router";

const PAGE_NAME = "Private Quiz";
const NEW_QUESTION_DELAY_MS = 1500;

const WrongKeyErrorCard: React.FC<{ secretKey: string }> = ({ secretKey }) => {
    return (
        <IonCard>
            <IonCardHeader>
                <IonCardSubtitle>Error</IonCardSubtitle>
                <IonCardTitle>Wrong Key</IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
                { `There's no private quiz with secret key '${secretKey}'!\nGet the right one and try again ` }
                <IonRouterLink routerLink="/private-quiz">here</IonRouterLink>
            </IonCardContent>
        </IonCard>
    );
}

const QuizResultCard: React.FC<{
    questionsSetName: string,
    correctAnswers: number,
    numberOfQuestions: number
}> = ({
        questionsSetName,
        correctAnswers,
        numberOfQuestions
}) => {
    const studentPercentageResult = Math.round(correctAnswers / numberOfQuestions * 100);

    return (
        <IonCard>
            <IonCardHeader>
                <IonCardSubtitle>
                    { `Quiz: ${ questionsSetName }` }
                </IonCardSubtitle>
                <IonCardTitle>
                    You finished the quiz!
                </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
                { `Your result is: ${correctAnswers} / ${numberOfQuestions} (${studentPercentageResult}%)` }
            </IonCardContent>
        </IonCard>
    );
}

export const PrivateQuiz: React.FC = () => {
    // @ts-ignore
    const { key } = useParams();

    const [isCorrectKey, setIsCorrectKey] = useState<boolean>(true);
    const [showResult, setShowResult] = useState(false);
    const [selected, setSelected] = useState<string | undefined>(undefined);

    const [quiz, setQuiz] = useState<QuestionsSetResponse | undefined>(undefined);
    const [numberOfQuestions, setNumberOfQuestions] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState<TeacherQuestionResponse | undefined>(undefined);
    const [questionNumber, setQuestionNumber] = useState(0);

    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [showLoading, setShowLoading] = useState(false);

    useEffect(() => {
        setShowLoading(true);
        getQuiz().finally(() => setShowLoading(false));
    }, []);

    useEffect(() => {
        setCurrentQuestion(quiz?.teacherQuestionsResponse[questionNumber]);
    }, [questionNumber]);

    const getQuiz = () => {
        return quizService.get(key)
            .then(res => {
                console.log(`Chosen key: ${key}`);
                console.log(`Downloaded quiz: ${res.questionsSetName}`);

                setQuiz(res);
                setNumberOfQuestions(res.teacherQuestionsResponse.length);
                setCurrentQuestion(res.teacherQuestionsResponse[questionNumber]);
            })
            .catch(err => {
                console.log(err);
                setIsCorrectKey(false);
            });
    }

    const getNextQuestion = () => {
        setShowResult(false);
        setQuestionNumber(prev => prev+1);
    }

    const checkAnswer = () => {
        selected === currentQuestion?.correct ? setCorrectAnswers(prev => prev+1) : setCorrectAnswers(prev => prev);
        setShowResult(true);
        setTimeout(getNextQuestion, NEW_QUESTION_DELAY_MS);
    }

    const answerItems = currentQuestion && currentQuestion.answers.map(answer =>
        <Answer
            name={ answer }
            showCorrect={ showResult && answer === currentQuestion.correct }
            showWrong={ showResult && answer === selected && answer !== currentQuestion.correct }
            key={ answer }
        />
    );

    return(
        <IonPage>
            <PageHeader name={ PAGE_NAME } />
            <IonContent className="ion-padding">
                <IonLoading
                    isOpen={ showLoading }
                    message={ 'Loading...' }
                />

                {
                    !isCorrectKey ? <WrongKeyErrorCard secretKey={key} /> :
                        <>
                            {
                                !currentQuestion ?
                                    <QuizResultCard
                                        questionsSetName={ quiz ? quiz.questionsSetName : ''  }
                                        correctAnswers={ correctAnswers }
                                        numberOfQuestions={ numberOfQuestions }
                                    /> :
                                    <>
                                        <IonCard>
                                            <IonCardHeader>
                                                <IonCardSubtitle>
                                                    { `Quiz: ${ quiz ? quiz.questionsSetName : '' }` }
                                                </IonCardSubtitle>
                                                <IonCardTitle>
                                                    { `Question ${questionNumber+1} of ${numberOfQuestions}` }
                                                </IonCardTitle>
                                            </IonCardHeader>
                                            <IonCardContent style={{ textAlign: "justify" }}>
                                                { currentQuestion?.question }
                                            </IonCardContent>
                                        </IonCard>
                                        <IonList>
                                            <IonRadioGroup value={ selected } onIonChange={e => setSelected(e.detail.value)}>
                                                { answerItems }
                                            </IonRadioGroup>
                                        </IonList>

                                        <IonButton
                                            onClick={checkAnswer}
                                            disabled={ selected === undefined || showResult }
                                            expand="block"
                                            style={{ marginTop: 20, marginBottom: 30 }}
                                        >
                                            Next
                                        </IonButton>
                                    </>
                            }
                        </>
                }
        </IonContent>
        </IonPage>
    )
};
