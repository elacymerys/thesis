import { IonItem, IonLabel, IonRadio } from "@ionic/react";
import './Answer.css';

const Answer: React.FC<{ name: string, showCorrect: boolean, showWrong: boolean, disabled: boolean }> = props => {
    return (
        <IonItem color={ props.showCorrect ? 'correct': (props.showWrong ? 'wrong' : '') }>
            <IonLabel>
                { props.name }
            </IonLabel>
            <IonRadio
                slot="start"
                value={ props.name }
                disabled={ props.disabled }
            />
        </IonItem>
    );
}

export default Answer;
