import React, {useEffect, useState} from "react";
import {
    IonButton, IonButtons,
    IonContent, IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonPage, IonText, useIonToast
} from "@ionic/react";
import {useHistory} from "react-router";
import {keyOutline, create, trashBin} from "ionicons/icons";
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
    const { tryRefreshTokens } = useUserContext();
    const history = useHistory();

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
                <IonButton onClick={ copyKeyToClipboard }>
                    <IonIcon
                        slot="icon-only"
                        icon={keyOutline}
                    ></IonIcon>
                </IonButton>
                <IonButton
                    routerLink={`/quiz-editor/${questionsSetKey}`}
                    routerDirection="back"
                >
                    <IonIcon
                        slot="icon-only"
                        icon={create}
                    ></IonIcon>
                </IonButton>
                <IonButton
                    onClick={handleDelete}
                >
                    <IonIcon
                        slot="icon-only"
                        icon={trashBin}
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
                    style={{ marginBottom: "30px" }}
                >
                    Create new quiz
                </IonButton>
                {
                    quizzesListItems.length > 0 &&
                    <IonText style={{ paddingLeft: "15px" }}>
                        * Click on <IonIcon icon={keyOutline} /> to copy key to clipboard, on <IonIcon icon={create} /> to edit a quiz or on <IonIcon icon={trashBin} /> to delete a quiz
                    </IonText>
                }
                <IonList lines="full" style={{ paddingTop: "15px" }}>
                    { quizzesListItems }
                </IonList>
            </IonContent>
        </IonPage>
    );
}
