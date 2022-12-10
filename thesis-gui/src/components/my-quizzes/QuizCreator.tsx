import React from "react";
import {QuestionForm} from "../../types/my-quizz";
import {QuizBuilder} from "./quiz-builder/QuizBuilder";
import {PageHeader} from "../common/PageHeader";
import {IonPage} from "@ionic/react";

const PAGE_NAME = 'Quiz Creator';

export const QuizCreator: React.FC = () => {
    const questions = [{
        question: { value: '', errorMessage: '' },
        answers: { values: ['', '', '', ''], errorMessages: ['', '', '', ''] },
        correct: 0
    }];

    const handleSubmit = (questionsSetName: string, questions: QuestionForm[]) => {
        console.log(questionsSetName, questions);
        //TODO
    };

    return (
        <IonPage>
            <PageHeader name={PAGE_NAME}/>
            <QuizBuilder
                initQuestions={questions}
                onSubmit={handleSubmit}
            />
        </IonPage>
    );
}
