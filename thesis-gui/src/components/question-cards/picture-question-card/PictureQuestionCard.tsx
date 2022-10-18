import {
    IonCard, IonCardContent,
    IonCardHeader,
    IonCardSubtitle, IonCardTitle, IonItem, IonNote
} from '@ionic/react';
import './PictureQuestionCard.css';
import { CategoryType } from "../../../types/category-type";
import { AdditionalInfoType } from "../../../types/additional-info-type";


const PictureQuestionCard: React.FC<{ question: string, questionNumber: number, category: CategoryType, additionalInfo: AdditionalInfoType }> = props => {
    return (
        <IonCard>
            <img src={ props.question } />
            <IonItem lines="none">
                <IonNote>
                    { `Author: ${props.additionalInfo.authorName}` }
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

export default PictureQuestionCard;
