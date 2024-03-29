import {
    IonButton,
    IonContent,
    IonList, IonLoading,
    IonPage, IonRadioGroup
} from '@ionic/react';
import { useEffect, useState } from "react";
import { HttpStatusCode } from "../../utils/http-status-code";
import { CategoryType } from "../../types/category-type";
import Answer from "../answer/Answer";
import { QuestionType } from "../../utils/question-type";
import {questionService} from "../../services/question-service";
import {useCategoryContext} from "../../context/CategoryContext";
import {DefinitionQuestionCard} from "../question-cards/definition-question-card/DefinitionQuestionCard";
import {PictureQuestionCard} from "../question-cards/picture-question-card/PictureQuestionCard";
import {useUserContext} from "../../context/UserContext";
import {useHistory} from "react-router";
import {ApiError, isApiError} from "../../types/api-error";
import {QuestionResponse} from "../../types/question-response";
import {PageHeader} from "../common/PageHeader";

const PAGE_NAME = "Ranked Quiz";
const NEW_QUESTION_DELAY_MS = 1500;

export const RankedQuiz: React.FC = () => {
    const { tryRefreshTokens } = useUserContext();
    const { chosenCategories, getRandom } = useCategoryContext();
    const history = useHistory();

    const [selected, setSelected] = useState<string | undefined>(undefined);
    const [questionNumber, setQuestionNumber] = useState(0);
    const [category, setCategory] = useState<CategoryType | undefined>(undefined);
    const [question, setQuestion] = useState<QuestionResponse | undefined>(undefined);
    const [showLoading, setShowLoading] = useState(false);
    const [showResult, setShowResult] = useState(false);

    useEffect(() => {
        if (chosenCategories.length === 0) {
            history.push('/categories');
            return;
        }

        setShowLoading(true);
        getNewQuestion().finally(() => setShowLoading(false));
    }, [chosenCategories, history]);

    const answerItems = question && question.answers.map(answer =>
        <Answer
            name={ answer }
            showCorrect={ showResult && answer === question.correct.name }
            showWrong={ showResult && answer === selected && answer !== question.correct.name }
            disabled={showResult}
            key={ answer }
        />
    );

    const checkAnswer = () => {
        setShowResult(true);

        questionService.sendAnswer({ termId: question!.correct.id, answerCorrect: selected === question!.correct.name })
            .then(() => setTimeout(getNewQuestion, NEW_QUESTION_DELAY_MS))
            .catch(err => {
                if (isApiError(err) && (err as ApiError).apiStatusCode === HttpStatusCode.UNAUTHORIZED) {
                    tryRefreshTokens().then(checkAnswer);
                } else {
                    history.push('/error-page');
                }
            });
    }

    const getNewQuestion = () => {
        const randomCategory = getRandom()!;
        return questionService.get(randomCategory.id)
            .then(res => {
                console.log(`Correct answer: ${res.correct.name}`)
                setCategory(randomCategory);
                setQuestion(res);
                setSelected(undefined);
                setQuestionNumber(prev => prev + 1);
            })
            .catch(err => {
                if (isApiError(err) && (err as ApiError).apiStatusCode === HttpStatusCode.UNAUTHORIZED) {
                    tryRefreshTokens().then(getNewQuestion);
                } else {
                    history.push('/error-page');
                }
            })
            .finally(() => setShowResult(false));
    }

    const flagQuestion = (termId: number) => {
        setShowResult(true);
        questionService.flag(termId)
            .then(() => setTimeout(getNewQuestion, NEW_QUESTION_DELAY_MS))
            .catch(err => {
                if (isApiError(err) && (err as ApiError).apiStatusCode === HttpStatusCode.UNAUTHORIZED) {
                    tryRefreshTokens().then(() => flagQuestion(termId));
                } else {
                    history.push('/error-page');
                }
            });
    };

    return (
        <IonPage>
            <PageHeader name={ PAGE_NAME } />
            <IonContent fullscreen>
                <IonLoading
                    isOpen={ showLoading }
                    message={ 'Loading...' }
                />

                {
                    ( question && question.type === QuestionType.DEFINITION &&
                    <DefinitionQuestionCard
                        question={ question.question }
                        questionNumber={ questionNumber }
                        category={ category! }
                        flagDisabled={showResult}
                        flagQuestion={() => flagQuestion(question?.correct.id)}
                    /> ) ||
                    ( question && question.type === QuestionType.PICTURE &&
                    <PictureQuestionCard
                        question={ question.question }
                        questionNumber={ questionNumber }
                        category={ category! }
                        authorName={ question.authorName! }
                        flagDisabled={showResult}
                        flagQuestion={() => flagQuestion(question?.correct.id)}
                    /> )
                }

                <IonList>
                    <IonRadioGroup value={ selected } onIonChange={e => setSelected(e.detail.value)}>
                        { answerItems }
                    </IonRadioGroup>
                </IonList>

                <IonButton
                    onClick={ checkAnswer }
                    disabled={ selected === undefined || showResult }
                    expand="block"
                    style={{ marginTop: 20, marginBottom: 30 }}
                >
                    Check
                </IonButton>

            </IonContent>
        </IonPage>
    );
}
