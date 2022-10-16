import {
    IonCard, IonCardContent,
    IonCardHeader,
    IonCardSubtitle, IonCardTitle, IonImg, IonItem, IonLabel, IonThumbnail
} from '@ionic/react';
import './PictureQuestionCard.css';
import { CategoryType } from "../../../types/category-type";
import { AdditionalInfoType } from "../../../types/additional-info-type";


const PictureQuestionCard: React.FC<{ question: string, questionNumber: number, category: CategoryType, additionalInfo: AdditionalInfoType }> = props => {
    return (
        <IonCard>
            {/*<IonItem>*/}
            {/*    <IonThumbnail>*/}
            {/*        <IonImg src={ props.question.pictureURL } />*/}
            {/*    </IonThumbnail>*/}
            {/*    <IonLabel>*/}
            {/*        { `Author: ${props.question.authorName}` }*/}
            {/*    </IonLabel>*/}
            {/*</IonItem>*/}

            <img src={ props.question } />
            <p>
                { `Author: ${props.additionalInfo.authorName}` }
            </p>

            <IonCardHeader>
                <IonCardSubtitle>
                    { `Category ${!!props.category ? props.category.name : ''}` }
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
