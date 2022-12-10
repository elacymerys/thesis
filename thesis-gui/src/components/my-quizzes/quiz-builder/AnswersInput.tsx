import React, {useState} from "react";
import {
    InputChangeEventDetail,
    IonInput,
    IonItem,
    IonList,
    IonRadio,
    IonRadioGroup,
    RadioGroupChangeEventDetail
} from "@ionic/react";
import {validateAnswer} from "../../../utils/validators";
import {FormErrorMessage} from "../../common/FormErrorMessage";

export const AnswersInput: React.FC<{
    answers: { values: string[], errorMessages: string[] },
    correct: number,
    onTextChange: (answerNumber: number, value: string, errorMessage: string) => void,
    onCorrectChange: (correct: number) => void
}> = ({
    answers: { values, errorMessages },
    correct,
    onTextChange,
    onCorrectChange
}) => {
    //workaround for: https://github.com/ionic-team/ionic-framework/issues/20106
    const [hasFocus, setFocus] = useState<boolean>(false);

    const handleTextChange = (answerNumber: number, e: CustomEvent<InputChangeEventDetail>) => {
        //stop propagation of ionChange event, so this event is not caught in IonRadioGroup ionChange handler
        e.stopPropagation();
        if (!hasFocus) {
            return;
        }
        const answerError = validateAnswer(e.detail.value!);
        onTextChange(answerNumber, e.detail.value!, answerError);
    };

    const answerInputItems = [0, 1, 2, 3].map(answerNumber => (
        <div key={answerNumber.toString()}>
            <IonItem
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
            >
                <IonInput
                    placeholder={ `Enter answer ${answerNumber + 1}` }
                    value={values[answerNumber]}
                    onIonChange={e => handleTextChange(answerNumber, e)}
                />
                <IonRadio slot="end" value={answerNumber.toString()}></IonRadio>
            </IonItem>
            <FormErrorMessage>{errorMessages[answerNumber]}</FormErrorMessage>
        </div>
    ));

    const handleCorrectChange = (e: CustomEvent<RadioGroupChangeEventDetail>) => {
        if (!hasFocus) {
            return;
        }
        onCorrectChange(Number(e.detail.value))
    }

    return (
        <IonList>
            <IonRadioGroup
                value={correct.toString()}
                onIonChange={handleCorrectChange}
            >
                { answerInputItems }
            </IonRadioGroup>
        </IonList>
    );
}
