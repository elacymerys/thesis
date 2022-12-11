import React, {useCallback, useEffect, useMemo, useState} from "react";
import {
    IonButton,
    IonButtons,
    IonContent,
    IonIcon,
    IonItemDivider,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import {trashBin} from "ionicons/icons";
import {QuestionForm} from "../../../types/my-quiz";
import {QuestionInput} from "./QuestionInput";
import {AnswersInput} from "./AnswersInput";
import {NavigationButtons} from "./NavigationButtons";
import {QuizSaveForm} from "./QuizSaveForm";

export const QuizBuilder: React.FC<{
    initQuestions: QuestionForm[],
    initQuestionsSetName: string,
    onSubmit: (questionsSetName: string, questions: QuestionForm[]) => void
}> = ({
    initQuestions,
    initQuestionsSetName,
    onSubmit,
}) => {
    const [questions, setQuestions] = useState<QuestionForm[]>(initQuestions);
    const [currentQuestionNumber, setCurrentQuestionNumber] = useState<number>(0);

    useEffect(
        () => setQuestions(initQuestions),
        [initQuestions]
    );

    const currentQuestion = useMemo(
        //if update of currentQuestionNumber happened before creating new ranked-quiz object, fallback to last ranked-quiz
        () => questions[currentQuestionNumber] ?? questions[questions.length - 1],
        [questions, currentQuestionNumber]
    );
    const hasNextQuestion = currentQuestionNumber < questions.length - 1;

    const handleQuestionChange = (value: string, errorMessage: string) => {
        const newQuestions = [...questions];
        newQuestions.splice(currentQuestionNumber, 1, {
            ...currentQuestion,
            question: {value, errorMessage},
        });
        setQuestions(newQuestions);
    }

    const handleAnswerChange = (answerNumber: number, value: string, errorMessage: string) => {
        const newAnswers = {
            values: [...currentQuestion.answers.values]
                .map((currentValue, i) => i === answerNumber ? value : currentValue),
            errorMessages: [...currentQuestion.answers.errorMessages]
                .map((currentError, i) => i === answerNumber ? errorMessage : currentError)
        };

        const newQuestions = [...questions];
        newQuestions.splice(currentQuestionNumber, 1, {
            ...currentQuestion,
            answers: newAnswers,
        });
        setQuestions(newQuestions);
    }

    const handleCorrectChange = useCallback((correct: number) => {
        const newQuestions = [...questions];
        newQuestions.splice(currentQuestionNumber, 1, {
            ...currentQuestion,
            correct
        });
        setQuestions(newQuestions);
    }, [questions, currentQuestion, currentQuestionNumber]);

    const handleNext = () => {
        if (!hasNextQuestion) {
            const newQuestions = [...questions];
            setQuestions([...newQuestions, {
                question: {value: '', errorMessage: ''},
                answers: {values: ['', '', '', ''], errorMessages: ['', '', '', '']},
                correct: 0
            }]);
        }
        setCurrentQuestionNumber(currentQuestionNumber + 1);
    }

    const handlePrev = () => setCurrentQuestionNumber(prev => prev - 1);

    const handleDelete = () => {
        const newQuestions = [...questions];
        newQuestions.splice(currentQuestionNumber, 1);
        setQuestions(newQuestions);

        if (currentQuestionNumber >= newQuestions.length) {
            setCurrentQuestionNumber(currentQuestionNumber - 1);
        }
    };

    const handleSubmit = (questionsSetName: string) => {
        onSubmit(questionsSetName, questions);
    };

    return (
        <IonContent className="ion-padding">
            <IonToolbar>
                <IonTitle className="ion-padding">Question {currentQuestionNumber + 1}</IonTitle>
                <IonButtons slot="primary">
                    <IonButton
                        disabled={questions.length < 2}
                        onClick={handleDelete}
                    >
                        <IonIcon slot="icon-only" icon={trashBin}/>
                    </IonButton>
                </IonButtons>
            </IonToolbar>
            <QuestionInput
                question={currentQuestion.question}
                onChange={handleQuestionChange}
            />
            <AnswersInput
                answers={currentQuestion.answers}
                onTextChange={handleAnswerChange}
                correct={currentQuestion.correct}
                onCorrectChange={handleCorrectChange}
            />
            <NavigationButtons
                hasPrev={currentQuestionNumber > 0}
                hasNext={hasNextQuestion}
                onPrev={handlePrev}
                onNext={handleNext}
            />
            <IonItemDivider/>
            <QuizSaveForm
                questions={questions}
                initQuestionsSetName={initQuestionsSetName}
                onSave={handleSubmit}
            />
        </IonContent>
    );
};
