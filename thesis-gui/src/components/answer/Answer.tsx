import { IonItem, IonLabel, IonRadio } from "@ionic/react";
import './Answer.css';

const Answer: React.FC<{
    name: string,
    showCorrect: boolean,
    showWrong: boolean,
    disabled: boolean
}> = ({
    name,
    showCorrect,
    showWrong,
    disabled
}) => {
    return (
        <IonItem color={ showCorrect ? 'correct': (showWrong ? 'wrong' : '') }>
            <IonLabel>
                { name }
            </IonLabel>
            <IonRadio
                slot="start"
                value={ name }
                disabled={ disabled }
            />
        </IonItem>
    );
}

export default Answer;
