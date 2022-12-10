import React from "react";
import {IonButton, IonCol, IonGrid, IonIcon, IonRow} from "@ionic/react";
import {arrowBackOutline, arrowForwardOutline} from "ionicons/icons";

export const NavigationButtons: React.FC<{
    hasPrev: boolean,
    hasNext: boolean,
    onPrev: () => void,
    onNext: () => void,
}> = ({
    hasPrev,
    hasNext,
    onPrev,
    onNext,
}) => (
    <IonGrid>
        <IonRow>
            <IonCol style={{margin: 0, padding: 0}}>
                <IonButton
                    onClick={onPrev}
                    disabled={!hasPrev}
                    expand="full"
                    fill="clear"
                    style={{marginRight: 0, paddingRight: 0, borderRight: "solid"}}
                >
                    Prev
                    <IonIcon slot="start" icon={arrowBackOutline}></IonIcon>
                </IonButton>
            </IonCol>
            <IonCol style={{margin: 0, padding: 0}}>
                <IonButton
                    onClick={onNext}
                    expand="full"
                    fill="clear"
                    style={{marginLeft: 0, paddingLeft: 0}}
                >
                    {hasNext ? 'Next' : 'Add new'}
                    <IonIcon slot="end" icon={arrowForwardOutline}></IonIcon>
                </IonButton>
            </IonCol>
        </IonRow>
    </IonGrid>
);
