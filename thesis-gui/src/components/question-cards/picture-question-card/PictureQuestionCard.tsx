import {
    IonCard, IonCardContent,
    IonCardHeader,
    IonCardSubtitle, IonCardTitle, IonItem, IonNote
} from '@ionic/react';
import './PictureQuestionCard.css';
import { CategoryType } from "../../../types/category-type";


export const PictureQuestionCard: React.FC<{ question: string, questionNumber: number, category: CategoryType,
    authorName: string }> = props => {
    return (
        <IonCard>
            <img src={ props.question } alt="" />
            <IonItem lines="none">
                <IonNote>
                    { `Author: ${props.authorName}` }
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
};
