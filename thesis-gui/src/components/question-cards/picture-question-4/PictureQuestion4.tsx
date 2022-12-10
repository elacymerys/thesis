import React from "react";
import {
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle, IonCol,
    IonContent, IonGrid,
    IonHeader,
    IonPage, IonRow,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import './PictureQuestion4.css';

export const PictureQuestion4: React.FC = () => {
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
                    <IonCardHeader>
                        <IonCardSubtitle>
                            Category
                        </IonCardSubtitle>
                        <IonCardTitle>
                            Question
                        </IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                        Which picture shows a(n) <span>horse</span>?
                    </IonCardContent>

                </IonCard>

                <IonGrid>
                    <IonRow>
                        <IonCol>
                            <img src="https://cdn.pixabay.com/photo/2018/06/11/00/21/foal-3467629__480.jpg" alt="" />
                        </IonCol>
                        <IonCol>
                            <img src="https://cdn.pixabay.com/photo/2018/06/11/00/21/foal-3467629__480.jpg" alt="" />
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <img src="https://cdn.pixabay.com/photo/2018/06/11/00/21/foal-3467629__480.jpg" alt="" />
                        </IonCol>
                        <IonCol>
                            <img src="https://cdn.pixabay.com/photo/2018/06/11/00/21/foal-3467629__480.jpg" alt="" />
                        </IonCol>
                    </IonRow>
                </IonGrid>

                <IonButton
                    expand="block"
                    style={{ marginTop: 20, marginBottom: 30 }}
                >
                    Check
                </IonButton>
            </IonContent>
        </IonPage>
    );
}
