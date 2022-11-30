import React, {useEffect, useState} from "react";
import {
    IonButton,
    IonContent, IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonPage, IonText, useIonToast
} from "@ionic/react";
import {keyOutline} from "ionicons/icons";
import {PageHeader} from "../common/PageHeader";
import {quizzesService} from "../../services/quizzes-service";
import {QuizzesList} from "../../types/quizzes-list";

const PAGE_NAME = "My Quizzes";

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
                style={{ paddingRight: "10px" }}
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

    const quizzesListItems = quizzesList.map(quiz => {
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
                    quizzesListItems.length > 0 &&
                        <IonText style={{ paddingLeft: "15px" }}>
                            * Click on <IonIcon icon={keyOutline} /> to copy key to clipboard
                        </IonText>
                }
                <IonList lines="full" style={{ paddingTop: "15px" }}>
                    { quizzesListItems }
                </IonList>
            </IonContent>
        </IonPage>
    );
}
