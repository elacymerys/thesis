import React from "react";
import {QuestionForm, QuestionsSetRequest, TeacherQuestionRequest} from "../../types/my-quiz";
import {QuizBuilder} from "./quiz-builder/QuizBuilder";
import {PageHeader} from "../common/PageHeader";
import {IonPage} from "@ionic/react";
import {quizService} from "../../services/quiz-service";
import {useHistory} from "react-router";
import {ApiError, isApiError} from "../../types/api-error";
import {HttpStatusCode} from "../../utils/http-status-code";
import {useUserContext} from "../../context/UserContext";

const PAGE_NAME = 'PrivateQuiz Creator';

export const QuizCreator: React.FC = () => {
    const history = useHistory();
    const { tryRefreshTokens } = useUserContext();

    const questions = [{
        question: { value: '', errorMessage: '' },
        answers: { values: ['', '', '', ''], errorMessages: ['', '', '', ''] },
        correct: 0
    }];

    const createNewQuiz = (request: QuestionsSetRequest) => {
        quizService.createNew(request)
            .then(() => history.push('/my-quizzes'))
            .catch(err => {
                if (isApiError(err) && (err as ApiError).apiStatusCode === HttpStatusCode.UNAUTHORIZED) {
                    tryRefreshTokens().then(() => createNewQuiz(request));
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

        createNewQuiz({
            questionsSetName,
            teacherQuestionsRequest: questionsRequests
        });
    };

    return (
        <IonPage>
            <PageHeader name={PAGE_NAME}/>
            <QuizBuilder
                initQuestions={questions}
                initQuestionsSetName=""
                onSubmit={handleSubmit}
            />
        </IonPage>
    );
}
