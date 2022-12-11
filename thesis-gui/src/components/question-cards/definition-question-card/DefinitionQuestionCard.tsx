import React from "react";

import {
    IonButton, IonButtons,
    IonCard, IonCardContent,
    IonCardHeader,
    IonCardSubtitle, IonCardTitle, IonIcon
} from '@ionic/react';
import './DefinitionQuestionCard.css';
import {CategoryType} from "../../../types/category-type";
import {flagOutline} from "ionicons/icons";

export const DefinitionQuestionCard: React.FC<{
    question: string,
    questionNumber: number,
    category: CategoryType,
    flagDisabled: boolean,
    flagQuestion: () => void
}> = props => (
    <IonCard>
        <IonCardHeader>
            <IonCardSubtitle>
                {`Category: ${!!props.category ? props.category.name : ''}`}
            </IonCardSubtitle>
            <IonCardTitle style={{display: 'flex', justifyContent: 'space-between'}}>
                {`Question ${props.questionNumber || ''}`}
                <IonButtons>
                    <IonButton
                        disabled={props.flagDisabled}
                        onClick={props.flagQuestion}
                    >
                        <IonIcon slot="icon-only" icon={flagOutline}/>
                    </IonButton>
                </IonButtons>
            </IonCardTitle>
        </IonCardHeader>

        <IonCardContent style={{textAlign: "justify"}}>
            {props.question.replaceAll('*****', '_____')}
        </IonCardContent>
    </IonCard>
);
