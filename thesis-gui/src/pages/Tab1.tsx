import {
    IonButton,
    IonCard, IonCardContent,
    IonCardHeader,
    IonCardSubtitle, IonCardTitle,
    IonContent,
    IonHeader, IonItem, IonLabel, IonList,
    IonPage, IonRadio, IonRadioGroup,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import './Tab1.css';
import {useState} from "react";

const Tab1: React.FC = () => {
  const [selected, setSelected] = useState<string>(null!);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 1</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 1</IonTitle>
          </IonToolbar>
        </IonHeader>

          <IonCard>
              <IonCardHeader>
                  <IonCardSubtitle>
                      Category
                  </IonCardSubtitle>
                  <IonCardTitle>
                      Question X
                  </IonCardTitle>
              </IonCardHeader>

              <IonCardContent style={{ textAlign: "justify" }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                  et dolore magna aliqua. Libero nunc consequat.
              </IonCardContent>
          </IonCard>

          <IonList>
              <IonRadioGroup value={selected} onIonChange={e => setSelected(e.detail.value)}>
                  <IonItem>
                      <IonLabel>
                          Answer 1
                      </IonLabel>
                      <IonRadio slot="start" value="ans1" />
                  </IonItem>

                  <IonItem>
                      <IonLabel>
                          Answer 2
                      </IonLabel>
                      <IonRadio slot="start" value="ans2" />
                  </IonItem>

                  <IonItem>
                      <IonLabel>
                          Answer 3
                      </IonLabel>
                      <IonRadio slot="start" value="ans3" />
                  </IonItem>

                  <IonItem>
                      <IonLabel>
                          Answer 4
                      </IonLabel>
                      <IonRadio slot="start" value="ans4" />
                  </IonItem>
              </IonRadioGroup>
          </IonList>

          <IonButton expand="block">Check</IonButton>

      </IonContent>
    </IonPage>
  );
};

export default Tab1;
