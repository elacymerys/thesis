import React from "react";
import {IonText} from "@ionic/react";

export const FormErrorMessage: React.FC = ({children}) => (
    <IonText
        style={{
            color: 'red',
            display: 'block',
            margin: '6px 0 12px 0'
        }}
    >
        {children}
    </IonText>
);
