import React from "react";
import {
    IonButton, IonButtons,
    IonCard, IonCardContent,
    IonCardHeader,
    IonCardSubtitle, IonCardTitle, IonIcon, IonItem, IonNote
} from '@ionic/react';
import './PictureQuestionCard.css';
import {CategoryType} from "../../../types/category-type";
import {flag} from "ionicons/icons";

export const PictureQuestionCard: React.FC<{
    question: string,
    questionNumber: number,
    category: CategoryType,
    authorName: string,
    flagDisabled: boolean,
    flagQuestion: () => void
}> = ({
    question,
    questionNumber,
    category,
    authorName,
    flagDisabled,
    flagQuestion
}) => (
    <IonCard>
        <img src={question} alt=""/>
        <IonItem lines="none">
            <IonNote>
                {`Author: ${authorName}`}
            </IonNote>
        </IonItem>

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

        <IonCardContent>
            What is shown in the picture above?
        </IonCardContent>
    </IonCard>
);
