import React, {useState} from "react";
import {IonItem, IonTextarea, TextareaChangeEventDetail} from "@ionic/react";
import {validateQuestion} from "../../../utils/validators";
import {FormErrorMessage} from "../../common/FormErrorMessage";

export const QuestionInput: React.FC<{
    question: { value: string, errorMessage: string },
    onChange: (value: string, errorMessage: string) => void
}> = ({
          question: { value, errorMessage },
          onChange
      }) => {
    //workaround for: https://github.com/ionic-team/ionic-framework/issues/20106
    const [hasFocus, setFocus] = useState<boolean>(false);

    const handleOnChange = (e: CustomEvent<TextareaChangeEventDetail>) => {
        if (!hasFocus) {
            return;
        }
        const questionError = validateQuestion(e.detail.value!);
        onChange(e.detail.value!, questionError);
    };

    return (
        <>
            <IonItem>
                <IonTextarea
                    value={value}
                    onFocus={() => setFocus(true)}
                    onBlur={() => setFocus(false)}
                    onIonChange={handleOnChange}
                    autoGrow={true}
                    placeholder="Enter text of the question you'd like to ask! Below enter 4 possible answers and check the correct one"
                />
            </IonItem>
            <FormErrorMessage>{errorMessage}</FormErrorMessage>
        </>
    );
}
