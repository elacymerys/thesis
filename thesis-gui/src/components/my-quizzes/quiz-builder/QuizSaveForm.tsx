import React, {useEffect, useMemo, useState} from "react";
import {QuestionForm} from "../../../types/my-quizz";
import {InputChangeEventDetail, IonButton, IonCol, IonGrid, IonInput, IonItem, IonLabel, IonRow} from "@ionic/react";
import {validateQuestionsSetName} from "../../../utils/validators";
import {FormErrorMessage} from "../../common/FormErrorMessage";

export const QuizSaveForm: React.FC<{
    questions: QuestionForm[],
    onSave: (name: string) => void
}> = ({
    questions,
    onSave
}) => {
    const [questionsSetName, setQuestionsSetName] = useState<string>('');
    const [questionsSetNameErrorMessage, setQuestionsSetNameErrorMessage] = useState<string>('');

    const [wholeQuizErrorMessage, setWholeQuizErrorMessage] = useState<string>('');

    //Clear error message when user changes quiz content
    useEffect(
        () => setWholeQuizErrorMessage(''),
        [questions, questionsSetName]
    );

    const isFormValid = useMemo<boolean>(
        () => !questionsSetNameErrorMessage &&
            questions.every(q =>
                q.question.value && !q.question.errorMessage &&
                q.answers.values.every(v => v) && q.answers.errorMessages.every(err => !err)
            ),
        [questionsSetNameErrorMessage, questions]
    );

    const handleChange = (e: CustomEvent<InputChangeEventDetail>) => {
        setQuestionsSetName(e.detail.value!);
        setQuestionsSetNameErrorMessage(validateQuestionsSetName(e.detail.value!));
    };

    const handleSubmit = () => {
        if (!isFormValid) {
            setWholeQuizErrorMessage('Fix every error in quiz before saving it!');
            return;
        }
        onSave(questionsSetName);
    };

    return (
        <IonGrid>
            <IonRow class="ion-align-items-center">
                <IonCol>
                    <IonItem>
                        <IonLabel position="floating">Quiz name</IonLabel>
                        <IonInput
                            type="text"
                            onIonChange={handleChange}>
                        </IonInput>
                    </IonItem>
                    <FormErrorMessage>{questionsSetNameErrorMessage}</FormErrorMessage>
                </IonCol>
                <IonCol>
                    <IonButton
                        expand="block"
                        onClick={handleSubmit}
                    >
                        Save Quiz
                    </IonButton>
                    <FormErrorMessage>{wholeQuizErrorMessage}</FormErrorMessage>
                </IonCol>
            </IonRow>
        </IonGrid>
    );
};
