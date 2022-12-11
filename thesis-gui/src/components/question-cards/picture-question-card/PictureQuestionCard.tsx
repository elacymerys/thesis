import React from "react";
import {
    IonButton, IonButtons,
    IonCard, IonCardContent,
    IonCardHeader,
    IonCardSubtitle, IonCardTitle, IonIcon, IonItem, IonNote
} from '@ionic/react';
import './PictureQuestionCard.css';
import {CategoryType} from "../../../types/category-type";
import {flagOutline} from "ionicons/icons";

export const PictureQuestionCard: React.FC<{
    question: string,
    questionNumber: number,
    category: CategoryType,
    authorName: string,
    flagQuestion: () => void
}> = props => (
    <IonCard>
        <img src={props.question} alt=""/>
        <IonItem lines="none">
            <IonNote>
                {`Author: ${props.authorName}`}
            </IonNote>
        </IonItem>

        <IonCardHeader>
            <IonCardSubtitle>
                {`Category: ${!!props.category ? props.category.name : ''}`}
            </IonCardSubtitle>
            <IonCardTitle style={{display: 'flex', justifyContent: 'space-between'}}>
                {`Question ${props.questionNumber || ''}`}
                <IonButtons>
                    <IonButton onClick={props.flagQuestion}>
                        <IonIcon slot="icon-only" icon={flagOutline}/>
                    </IonButton>
                </IonButtons>
            </IonCardTitle>
        </IonCardHeader>

        <IonCardContent>
            What is shown in the picture above?
        </IonCardContent>
    </IonCard>
);
