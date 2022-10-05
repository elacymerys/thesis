import {
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonContent,
    IonHeader, IonItem, IonLabel, IonList,
    IonPage, IonRadio, IonRadioGroup,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import './PictureQuestion.css';

const PictureQuestion: React.FC = () => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Questions</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Questions</IonTitle>
                    </IonToolbar>
                </IonHeader>

                <IonCard>
                    <img src="https://cdn.pixabay.com/photo/2018/06/11/00/21/foal-3467629__480.jpg" />
                    <IonCardHeader>
                        <IonCardSubtitle>
                            Category
                        </IonCardSubtitle>
                        <IonCardTitle>
                            Question
                        </IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                        What is shown in the picture above?
                    </IonCardContent>
                </IonCard>

                <IonList>
                    <IonRadioGroup>
                        <IonItem>
                            <IonLabel>
                                Answer 1
                            </IonLabel>
                            <IonRadio slot="start"  />
                        </IonItem>
                        <IonItem>
                            <IonLabel>
                                Answer 2
                            </IonLabel>
                            <IonRadio slot="start"  />
                        </IonItem>
                        <IonItem>
                            <IonLabel>
                                Answer 3
                            </IonLabel>
                            <IonRadio slot="start"  />
                        </IonItem>
                        <IonItem>
                            <IonLabel>
                                Answer 4
                            </IonLabel>
                            <IonRadio slot="start"  />
                        </IonItem>
                    </IonRadioGroup>
                </IonList>

                <IonButton
                    expand="block"
                    style={{ marginTop: 20, marginBottom: 30 }}
                >
                    Check
                </IonButton>
            </IonContent>
        </IonPage>
    );
};

export default PictureQuestion;
