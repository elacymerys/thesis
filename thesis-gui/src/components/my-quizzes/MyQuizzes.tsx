import React, {useEffect, useState} from "react";
import {
    IonButton, IonCard, IonCardContent,
    IonContent, IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonPage, IonText, useIonToast
} from "@ionic/react";
import {createOutline, keyOutline, refreshOutline, trashOutline} from "ionicons/icons";
import {PageHeader} from "../common/PageHeader";
import {quizzesService} from "../../services/quizzes-service";
import {QuizzesList} from "../../types/quizzes-list";

const PAGE_NAME = "My Quizzes";

const QUIZZES = [
    {
        questionsSetName: "Quiz 1",
        numberOfQuestionsInSet: 5,
        questionsSetKey: "kkadnada"
    },
    {
        questionsSetName: "Quiz 2",
        numberOfQuestionsInSet: 27,
        questionsSetKey: "efewkdew"
    },
    {
        questionsSetName: "Quiz 3",
        numberOfQuestionsInSet: 8,
        questionsSetKey: "jknwkjnd"
    },
    {
        questionsSetName: "Quiz 4",
        numberOfQuestionsInSet: 13,
        questionsSetKey: "knkdqndq"
    }
];

const QuizzesListItem: React.FC<{
    name: string,
    questionsNumber: number,
    _key: string
}> = ({ name, questionsNumber, _key }) => {
    const [present] = useIonToast();

    const presentToast = () => {
        present({
            message: `"${name}" quiz key was copied to clipboard!`,
            duration: 1500,
            position: 'bottom'
        });
    };

    const copyKeyToClipboard = () => {
        navigator.clipboard.writeText(_key);
        presentToast();
    }

    const refreshKey = () => {
        console.log('REFRESH');
        quizzesService.refreshQuestionSetKey({ questionsSetKey: _key })
            .then(res => console.log('REFRESH'))
            .catch(err => console.log(err));
    }

    const editQuiz = () => {
        console.log('EDIT');
    }

    const deleteQuiz = () => {
        console.log('DELETE');
        quizzesService.deleteQuestionSet({ questionsSetKey: _key })
            .then(res => console.log('DELETE'))
            .catch(err => console.log(err));
    }

    return (
        <IonItem>
            <IonLabel>
                <h2>{ name }</h2>
                <p>{ `${questionsNumber} question(s)` }</p>
            </IonLabel>
            <IonIcon
                className="btn"
                icon={keyOutline}
                onClick={ copyKeyToClipboard }
                style={{ paddingRight: "15px" }}
            ></IonIcon>
            <IonIcon
                className="btn"
                icon={refreshOutline}
                onClick={ refreshKey }
                style={{ paddingRight: "15px" }}
            ></IonIcon>
            <IonIcon
                className="btn"
                icon={createOutline}
                onClick={ editQuiz }
                style={{ paddingRight: "15px" }}
            ></IonIcon>
            <IonIcon
                className="btn"
                icon={trashOutline}
                onClick={ deleteQuiz }
            ></IonIcon>
        </IonItem>
    );
}

export const MyQuizzes: React.FC = () => {
    const [quizzesList, setQuizzesList] = useState<QuizzesList>([]);

    const getQuizzesList = () => {
        quizzesService.getList()
            .then(res => setQuizzesList(res))
            .catch(err => console.log(err));
    }

    useEffect(() => {
        getQuizzesList();
    }, []);

    const quizzesListItems = QUIZZES.map(quiz => {
        return <QuizzesListItem
            name={ quiz.questionsSetName }
            questionsNumber={ quiz.numberOfQuestionsInSet }
            _key={ quiz.questionsSetKey }
        />
    });

    return (
        <IonPage>
            <PageHeader name={ PAGE_NAME } condense={ false } />
            <IonContent className="ion-padding">
                <PageHeader name={ PAGE_NAME } condense={ true } />
                <IonButton
                    routerLink="/quiz-creator"
                    routerDirection="back"
                    expand="block"
                    style={{ marginBottom: "30px" }}
                >
                    Create new quiz
                </IonButton>
                {
                    QUIZZES.length > 0 &&
                    <IonCard>
                        <IonCardContent>
                            * Click on <IonIcon icon={keyOutline} /> to copy key to clipboard
                            or <IonIcon icon={refreshOutline} /> to refresh it
                        </IonCardContent>
                    </IonCard>
                    // quizzesListItems.length > 0 &&
                    //     <IonText style={{ paddingLeft: "15px" }}>
                    //         * Click on <IonIcon icon={keyOutline} /> to copy key to clipboard
                    //         or <IonIcon icon={refreshOutline} /> to refresh it
                    //     </IonText>
                }
                <IonList lines="full" style={{ paddingTop: "15px" }}>
                    { quizzesListItems }
                </IonList>
            </IonContent>
        </IonPage>
    );
}
