import React, {useEffect, useState} from "react";
import {
    IonButton, IonButtons, IonCard, IonCardContent,
    IonContent, IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonPage, useIonToast
} from "@ionic/react";
import {useHistory} from "react-router";
import {keyOutline, createOutline, trashBinOutline, refreshOutline} from "ionicons/icons";
import {PageHeader} from "../common/PageHeader";
import {quizService} from "../../services/quiz-service";
import {Quiz} from "../../types/my-quiz";
import {useUserContext} from "../../context/UserContext";
import {ApiError, isApiError} from "../../types/api-error";
import {HttpStatusCode} from "../../utils/http-status-code";

const PAGE_NAME = "My Quizzes";

const QuizzesListItem: React.FC<{
    name: string,
    questionsSetKey: string,
    reloadQuizzes: () => void
}> = ({
    name,
    questionsSetKey,
    reloadQuizzes
}) => {
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

    const handleRefresh = () => {
        quizService.refreshKey({ questionsSetKey: questionsSetKey })
            .then(res => {
                presentToast(`"${name}" quiz key was refreshed!`);
                reloadQuizzes();
            })
            .catch(err => {
                if (isApiError(err) && (err as ApiError).apiStatusCode === HttpStatusCode.UNAUTHORIZED) {
                    tryRefreshTokens().then(handleRefresh);
                } else {
                    history.push('/error-page');
                }
            });
    }

    const handleDelete = () => {
        quizService.delete(questionsSetKey)
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
                <p>
                    <IonIcon
                        slot="icon-only"
                        icon={keyOutline}
                    ></IonIcon>
                    { ` ${questionsSetKey}` }
                </p>
            </IonLabel>
            <IonButtons>
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
                            Click on <IonIcon icon={refreshOutline} /> to refresh key,
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
