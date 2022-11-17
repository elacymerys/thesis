import {
    IonButton,
    IonContent,
    IonList, IonLoading,
    IonPage, IonRadioGroup
} from '@ionic/react';
import './Quiz.css';
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


export const Quiz: React.FC = () => {
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
            key={ answer }
        />
    );

    const checkAnswer = () => {
        console.log(`${selected === question!.correct.name ? 'CORRECT' : 'NOT CORRECT'}`);
        setShowResult(true);

        questionService.sendAnswer(question!.correct.id, { answerCorrect: selected === question!.correct.name })
            .then(() => setTimeout(getNewQuestion, 1500))
            .catch(err => {
                if (isApiError(err) && (err as ApiError).apiStatusCode === HttpStatusCode.UNAUTHORIZED) {
                    tryRefreshTokens().then(checkAnswer);
                } else {
                    console.log(err);
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
            .catch(err => console.log(err))
            .finally(() => setShowResult(false));
    }

    return (
        <IonPage>
            <PageHeader name={ "Questions" } condense={ false } />
            <IonContent fullscreen>
                <IonLoading
                    isOpen={ showLoading }
                    message={ 'Loading...' }
                />
                <PageHeader name={ "Questions" } condense={ true } />

                {
                    ( question && question.type === QuestionType.DEFINITION &&
                    <DefinitionQuestionCard
                        question={ question.question }
                        questionNumber={ questionNumber }
                        category={ category! }
                    /> ) ||
                    ( question && question.type === QuestionType.PICTURE &&
                    <PictureQuestionCard
                        question={ question.question }
                        questionNumber={ questionNumber }
                        category={ category! }
                        authorName={ question.authorName! }
                    /> )
                }

                <IonList>
                    <IonRadioGroup value={ selected } onIonChange={e => setSelected(e.detail.value)}>
                        { answerItems }
                    </IonRadioGroup>
                </IonList>

                <IonButton
                    onClick={ checkAnswer }
                    disabled={ showResult }
                    expand="block"
                    style={{ marginTop: 20, marginBottom: 30 }}
                >
                    Check
                </IonButton>

            </IonContent>
        </IonPage>
    );
};
