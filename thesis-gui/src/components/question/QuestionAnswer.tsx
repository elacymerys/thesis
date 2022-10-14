import {FC} from "react";
import {IonItem, IonLabel, IonRadio} from "@ionic/react";

export const QuestionAnswer: FC<{
    name: string,
    showCorrect: boolean,
    showWrong: boolean
}> = ({
     name,
     showCorrect,
     showWrong
}) => {
    return (
        <IonItem color={showCorrect ? 'correct': (showWrong ? 'wrong' : '')}>
            <IonLabel>
                { name }
            </IonLabel>
            <IonRadio slot="start" value={ name }/>
        </IonItem>
    );
}
