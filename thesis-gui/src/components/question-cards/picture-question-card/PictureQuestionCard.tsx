import React from "react";
import {
    IonCard, IonCardContent,
    IonCardHeader,
    IonCardSubtitle, IonCardTitle, IonItem, IonNote
} from '@ionic/react';
import './PictureQuestionCard.css';
import { CategoryType } from "../../../types/category-type";
import {unsplashURL} from "../../../utils/consts";
import {referral} from "../../../utils/consts";

export const PictureQuestionCard: React.FC<{ question: string, questionNumber: number, category: CategoryType,
    authorName: string, authorProfileURL: string}> = props => {
    return (
        <IonCard>
            <img src={ props.question } alt="" />
            <IonItem lines="none">
                <IonNote style={{ "font-size": "1em"}}>
                    <p>Picture by: <a
                        href={props.authorProfileURL + referral}>{props.authorName}</a> on <a
                        href={unsplashURL + referral}>Unsplash</a>
                    </p>
                </IonNote>
            </IonItem>

            <IonCardHeader>
                <IonCardSubtitle>
                    { `Category: ${!!props.category ? props.category.name : ''}` }
                </IonCardSubtitle>
                <IonCardTitle>
                    { `Question ${props.questionNumber || ''}` }
                </IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
                What is shown in the picture above?
            </IonCardContent>
        </IonCard>
    );
}
