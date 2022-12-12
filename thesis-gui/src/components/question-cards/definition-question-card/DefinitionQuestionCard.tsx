import React from "react";

import {
    IonButton, IonButtons,
    IonCard, IonCardContent,
    IonCardHeader,
    IonCardSubtitle, IonCardTitle, IonIcon
} from '@ionic/react';
import './DefinitionQuestionCard.css';
import {CategoryType} from "../../../types/category-type";
import {flag} from "ionicons/icons";

export const DefinitionQuestionCard: React.FC<{
    question: string,
    questionNumber: number,
    category: CategoryType,
    flagDisabled: boolean,
    flagQuestion: () => void
}> = ({
    question,
    questionNumber,
    category,
    flagDisabled,
    flagQuestion
}) => (
    <IonCard>
        <IonCardHeader>
            <IonCardSubtitle>
                {`Category: ${!!category ? category.name : ''}`}
            </IonCardSubtitle>
            <IonCardTitle style={{display: 'flex', justifyContent: 'space-between'}}>
                {`Question ${questionNumber || ''}`}
                <IonButtons>
                    <IonButton
                        disabled={flagDisabled}
                        onClick={flagQuestion}
                    >
                        <IonIcon slot="icon-only" icon={flag}/>
                    </IonButton>
                </IonButtons>
            </IonCardTitle>
        </IonCardHeader>

        <IonCardContent style={{textAlign: "justify"}}>
            {question.replaceAll('*****', '_____')}
        </IonCardContent>
    </IonCard>
);
