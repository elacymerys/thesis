import React, {useEffect, useState} from "react";
import {
    IonButton,
    IonContent, IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonPage, IonText, useIonToast
} from "@ionic/react";
import {useHistory} from "react-router";
import {keyOutline} from "ionicons/icons";
import {PageHeader} from "../common/PageHeader";
import {quizService} from "../../services/quiz-service";
import {Quiz} from "../../types/my-quiz";
import {useUserContext} from "../../context/UserContext";
import {ApiError, isApiError} from "../../types/api-error";
import {HttpStatusCode} from "../../utils/http-status-code";

const PAGE_NAME = "My Quizzes";

const QuizzesListItem: React.FC<{
    name: string,
    questionsNumber: number,
    questionsSetKey: string
}> = ({ name, questionsNumber, questionsSetKey }) => {
    const [present] = useIonToast();

    const presentToast = () => {
        present({
            message: `"${name}" quiz key was copied to clipboard!`,
            duration: 1500,
            position: 'bottom'
        });
    };

    const copyKeyToClipboard = () => {
        navigator.clipboard.writeText(questionsSetKey);
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
    const { tryRefreshTokens } = useUserContext();
    const history = useHistory();

    const [quizzesList, setQuizzesList] = useState<Quiz[]>([]);

    const getQuizzesList = () => {
        quizService.getList()
            .then(res => setQuizzesList(res))
            .catch(err => {
                if (isApiError(err) && (err as ApiError).apiStatusCode === HttpStatusCode.UNAUTHORIZED) {
                    tryRefreshTokens().then(getQuizzesList);
                } else {
                    history.push('/error-page');
                }
            });
    }

    useEffect(() => {
        getQuizzesList();
    }, []);

    const quizzesListItems = quizzesList.map(quiz => {
        return <QuizzesListItem
            key={quiz.questionsSetKey}
            name={ quiz.questionsSetName }
            questionsNumber={ quiz.numberOfQuestionsInSet }
            questionsSetKey={ quiz.questionsSetKey }
        />
    });

    return (
        <IonPage>
            <PageHeader name={ PAGE_NAME } />
            <IonContent className="ion-padding">
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
