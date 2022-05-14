import {
    IonButton,
    IonCheckbox,
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonPage,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import './Tab2.css';

const Tab2: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 2</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 2</IonTitle>
          </IonToolbar>
        </IonHeader>

          <IonList>
              <IonListHeader>Categories</IonListHeader>

              <IonItem>
                  <IonLabel>Category 1</IonLabel>
                  <IonCheckbox slot="start" />
              </IonItem>

              <IonItem>
                  <IonLabel>Category 2</IonLabel>
                  <IonCheckbox slot="start" />
              </IonItem>

              <IonItem>
                  <IonLabel>Category 3</IonLabel>
                  <IonCheckbox slot="start" />
              </IonItem>

              <IonItem>
                  <IonLabel>Category 4</IonLabel>
                  <IonCheckbox slot="start" />
              </IonItem>

              <IonItem>
                  <IonLabel>Category 5</IonLabel>
                  <IonCheckbox slot="start" />
              </IonItem>

              <IonItem>
                  <IonLabel>Category 6</IonLabel>
                  <IonCheckbox slot="start" />
              </IonItem>

              <IonItem>
                  <IonLabel>Category 7</IonLabel>
                  <IonCheckbox slot="start" />
              </IonItem>
          </IonList>

          <IonButton expand="block">Choose</IonButton>

      </IonContent>
    </IonPage>
  );
};

export default Tab2;
