import {
    IonCard, IonCardContent,
    IonCardHeader,
    IonCardSubtitle, IonCardTitle
} from '@ionic/react';
import './DefinitionQuestionCard.css';
import { CategoryType } from "../../../types/category-type";


const DefinitionQuestionCard: React.FC<{ question: string, questionNumber: number, category: CategoryType }> = props => {
    return (
        <IonCard>
            <IonCardHeader>
                <IonCardSubtitle>
                    { `Category: ${!!props.category ? props.category.name : ''}` }
                </IonCardSubtitle>
                <IonCardTitle>
                    { `Question ${props.questionNumber || ''}` }
                </IonCardTitle>
            </IonCardHeader>

            <IonCardContent style={{ textAlign: "justify" }}>
                { props.question.replaceAll('*****', '_____') }
            </IonCardContent>
        </IonCard>
    );
};

export default DefinitionQuestionCard;
