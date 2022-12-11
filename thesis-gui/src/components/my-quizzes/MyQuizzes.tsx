import React, {useEffect, useState} from "react";
import {
    IonButton, IonButtons, IonCard, IonCardContent,
    IonContent, IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonPage, IonText, useIonToast
} from "@ionic/react";
import {useHistory} from "react-router";
import {keyOutline, createOutline, trashBinOutline, refreshOutline} from "ionicons/icons";
import {PageHeader} from "../common/PageHeader";
import {quizzesService} from "../../services/quizzes-service";
import {Quiz} from "../../types/my-quiz";
import {useUserContext} from "../../context/UserContext";
import {ApiError, isApiError} from "../../types/api-error";
import {HttpStatusCode} from "../../utils/http-status-code";

const PAGE_NAME = "My Quizzes";

const QuizzesListItem: React.FC<{
    name: string,
    questionsNumber: number,
    questionsSetKey: string,
    reloadQuizzes: () => void
}> = ({
    name,
    questionsNumber,
    questionsSetKey,
    reloadQuizzes
}) => {
    const COPY_KEY_TOAST_MESSAGE = `"${name}" quiz key was copied to clipboard!`;
    const REFRESH_KEY_TOAST_MESSAGE = `"${name}" quiz key was refreshed and copied to clipboard!`;

    const { tryRefreshTokens } = useUserContext();
    const history = useHistory();

    const [present] = useIonToast();

    const presentToast = (toastMessage: string) => {
        present({
            message: toastMessage,
            duration: 1500,
            position: 'top'
        });
    };

    const copyKeyToClipboard = (key: string, toastMessage: string) => {
        navigator.clipboard.writeText(key);
        presentToast(toastMessage);
    }

    const handleRefresh = () => {
        quizzesService.refreshKey({ questionsSetKey: questionsSetKey })
            .then(res => {
                copyKeyToClipboard(res.questionsSetKey, REFRESH_KEY_TOAST_MESSAGE);
                reloadQuizzes();
            })
            .catch(err => {
                if (isApiError(err) && (err as ApiError).apiStatusCode === HttpStatusCode.UNAUTHORIZED) {
                    tryRefreshTokens().then(handleDelete);
                } else {
                    history.push('/error-page');
                }
            });
    }

    const handleDelete = () => {
        quizzesService.delete(questionsSetKey)
            .then(reloadQuizzes)
            .catch(err => {
                if (isApiError(err) && (err as ApiError).apiStatusCode === HttpStatusCode.UNAUTHORIZED) {
                    tryRefreshTokens().then(handleDelete);
                } else {
                    history.push('/error-page');
                }
            });
    };

    return (
        <IonItem>
            <IonLabel>
                <h2>{ name }</h2>
                <p>{ `${questionsNumber} question(s)` }</p>
            </IonLabel>
            <IonButtons>
                <IonButton onClick={ () => copyKeyToClipboard(questionsSetKey, COPY_KEY_TOAST_MESSAGE) }>
                    <IonIcon
                        slot="icon-only"
                        icon={keyOutline}
                    ></IonIcon>
                </IonButton>
                <IonButton
                    onClick={ handleRefresh }
                >
                    <IonIcon
                        slot="icon-only"
                        icon={refreshOutline}
                    ></IonIcon>
                </IonButton>
                <IonButton
                    routerLink={`/quiz-editor/${questionsSetKey}`}
                    routerDirection="back"
                >
                    <IonIcon
                        slot="icon-only"
                        icon={createOutline}
                    ></IonIcon>
                </IonButton>
                <IonButton
                    onClick={handleDelete}
                >
                    <IonIcon
                        slot="icon-only"
                        icon={trashBinOutline}
                    ></IonIcon>
                </IonButton>
            </IonButtons>
        </IonItem>
    );
}

export const MyQuizzes: React.FC = () => {
    const { tryRefreshTokens } = useUserContext();
    const history = useHistory();

    const [quizzesList, setQuizzesList] = useState<Quiz[]>([]);

    const getQuizzesList = () => {
        quizzesService.getList()
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
            reloadQuizzes={getQuizzesList}
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
                >
                    Create new quiz
                </IonButton>
                {
                    quizzesListItems.length > 0 &&
                    <IonCard>
                        <IonCardContent style={{ textAlign: "justify" }}>
                            Click on <IonIcon icon={keyOutline} /> to copy key to clipboard,
                            on <IonIcon icon={refreshOutline} /> to refresh key,
                            on <IonIcon icon={createOutline} /> to edit a quiz
                            or on <IonIcon icon={trashBinOutline} /> to delete a quiz
                        </IonCardContent>
                    </IonCard>
                }
                <IonList lines="full">
                    { quizzesListItems }
                </IonList>
            </IonContent>
        </IonPage>
    );
}
