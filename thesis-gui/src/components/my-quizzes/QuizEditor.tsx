import React, {useEffect, useState} from "react";
import {
    QuestionForm,
    QuestionsSetRequest,
    QuestionsSetResponse,
    TeacherQuestionRequest
} from "../../types/my-quiz";
import {QuizBuilder} from "./quiz-builder/QuizBuilder";
import {PageHeader} from "../common/PageHeader";
import {IonPage} from "@ionic/react";
import {quizService} from "../../services/quiz-service";
import {useHistory, useParams} from "react-router";
import {ApiError, isApiError} from "../../types/api-error";
import {HttpStatusCode} from "../../utils/http-status-code";
import {useUserContext} from "../../context/UserContext";

const PAGE_NAME = 'Quiz Editor';

export const QuizEditor: React.FC = () => {
    // @ts-ignore
    const { key } = useParams();
    const history = useHistory();
    const { tryRefreshTokens } = useUserContext();

    const [questionsSetName, setQuestionsSetName] = useState<string>('');
    const [questions, setQuestions] = useState<QuestionForm[]>([{
        question: { value: '', errorMessage: '' },
        answers: { values: ['', '', '', ''], errorMessages: ['', '', '', ''] },
        correct: 0
    }]);

    const updateQuestionsSet = (quiz: QuestionsSetResponse) => {
        setQuestions(quiz.teacherQuestionsResponse.map(q => ({
            question: { value: q.question, errorMessage: '' },
            answers: { values: q.answers, errorMessages: ['', '', '', ''] },
            correct: q.answers.findIndex(a => a === q.correct)
        })));
        setQuestionsSetName(quiz.questionsSetName);
    };

    const getQuestionsSet = () => {
        quizService.getQuiz(key)
            .then(updateQuestionsSet)
            .catch(err => {
                if (isApiError(err) && (err as ApiError).apiStatusCode === HttpStatusCode.UNAUTHORIZED) {
                    tryRefreshTokens().then(getQuestionsSet);
                } else {
                    history.push('/error-page');
                }
            });
    };

    useEffect(getQuestionsSet, [key]);

    const updateQuiz = (request: QuestionsSetRequest) => {
        quizService.update(key, request)
            .then(() => history.push('/my-quizzes'))
            .catch(err => {
                if (isApiError(err) && (err as ApiError).apiStatusCode === HttpStatusCode.UNAUTHORIZED) {
                    tryRefreshTokens().then(() => updateQuiz(request));
                } else {
                    history.push('/error-page');
                }
            });
    }

    const handleSubmit = (questionsSetName: string, questions: QuestionForm[]) => {
        const questionsRequests: TeacherQuestionRequest[] = questions.map(q => ({
            question: q.question.value,
            correct: q.answers.values[q.correct],
            answers: q.answers.values
        }));

        updateQuiz({
            questionsSetName,
            teacherQuestionsRequest: questionsRequests
        });
    };

    return (
        <IonPage>
            <PageHeader name={PAGE_NAME}/>
            <QuizBuilder
                initQuestions={questions}
                initQuestionsSetName={questionsSetName}
                onSubmit={handleSubmit}
            />
        </IonPage>
    );
}
