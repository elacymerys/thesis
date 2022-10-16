import {
    IonButton,
    IonContent,
    IonHeader, IonList, IonLoading,
    IonPage, IonRadioGroup,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import './Quizz.css';
import { useEffect, useState } from "react";
import QuestionService from "../../services/question-service";
import { HttpStatusCode } from "../../utils/http-status-code";
import CategoryStorage from "../../services/category-storage";
import { CategoryType } from "../../types/category-type";
import { CorrectType } from "../../types/correct-type";
import Answer from "../answer/Answer";
import DefinitionQuestionCard from "../question-cards/definition-question-card/DefinitionQuestionCard";
import { QuestionType } from "../../utils/question-type";
import PictureQuestionCard from "../question-cards/picture-question-card/PictureQuestionCard";
import { AdditionalInfoType } from "../../types/additional-info-type";


const Quizz: React.FC = () => {
    const [selected, setSelected] = useState<string>(null!);
    const [questionNumber, setQuestionNumber] = useState(0);
    const [category, setCategory] = useState<CategoryType>(null!);
    const [question, setQuestion] = useState<string>(null!);
    const [answers, setAnswers] = useState<string[]>([]);
    const [correct, setCorrect] = useState<CorrectType>(null!);
    const [type, setType] = useState<number>(null!)
    const [additionalInfo, setAdditionalInfo] = useState<AdditionalInfoType>(null!)
    const [showLoading, setShowLoading] = useState(false);
    const [showResult, setShowResult] = useState(false);

    const answerItems = answers.map(answer =>
        <Answer
            name={ answer }
            showCorrect={ showResult && answer === correct.name }
            showWrong={ showResult && answer === selected && answer !== correct.name }
        />
    );

    const checkAnswer = () => {
        console.log(`${selected === correct.name ? 'CORRECT' : 'NOT CORRECT'}`);
        setShowResult(true);

        QuestionService.sendAnswer(correct.id, { answerCorrect: selected === correct.name })
            .then(res => {
                if (res.status !== HttpStatusCode.NO_CONTENT) {
                    console.log(res.statusText);
                    return;
                }
            })
            .catch(err => console.log(err));

        getNewQuestion();
    }

    useEffect(() => {
        setShowLoading(true);
        getNewQuestion()?.finally(() => setShowLoading(false));
    }, []);

    const getNewQuestion = () => {
        if (CategoryStorage.isEmpty()) {
            console.log('Category storage is empty');
            return;
        }

        const randomCategory = CategoryStorage.getRandom();

        return QuestionService.get(randomCategory.id)
            .then(res => {
                if (res.status !== HttpStatusCode.OK) {
                    console.log(res.statusText);
                    return;
                }

                console.log(`Correct answer: ${res.data.correct.name}`)

                setQuestion(res.data.question);
                setAnswers(res.data.answers);
                setCorrect(res.data.correct);

                setType(res.data.type);
                setAdditionalInfo(res.data.additionalInfo);

                setSelected(null!);
                setQuestionNumber(prev => prev + 1);

                setCategory(randomCategory);
            })
            .catch(err => console.log(err))
            .finally(() => {
                setShowResult(false);
            });
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Questions</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonLoading
                    isOpen={ showLoading }
                    message={ 'Loading...' }
                />

                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Questions</IonTitle>
                    </IonToolbar>
                </IonHeader>

                {
                    type === QuestionType.DEFINITION &&
                    <DefinitionQuestionCard
                        question={ question }
                        questionNumber={ questionNumber }
                        category={ category }
                    /> ||
                    type === QuestionType.PICTURE &&
                    <PictureQuestionCard
                        question={ question }
                        questionNumber={ questionNumber }
                        category={ category }
                        additionalInfo={ additionalInfo }
                    />
                }

                <IonList>
                    <IonRadioGroup value={ selected } onIonChange={e => setSelected(e.detail.value)}>
                        { answerItems }
                    </IonRadioGroup>
                </IonList>

                <IonButton
                    onClick={ checkAnswer }
                    expand="block"
                    style={{ marginTop: 20, marginBottom: 30 }}
                >
                    Check
                </IonButton>

            </IonContent>
        </IonPage>
    );
};

export default Quizz;
