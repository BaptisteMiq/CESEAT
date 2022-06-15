import {
  IonContent, IonItem, IonLabel, IonList, IonPage, IonToggle
} from '@ionic/react';
import Store from '../../store';
import { setSettings } from '../../store/actions';
import * as selectors from '../../store/selectors';

const Settings = () => {
  const settings = Store.useState(selectors.getSettings);

  return (
    <IonPage>
      <IonContent>
        <IonList>
          <IonItem>
            <IonLabel>Enable Notifications</IonLabel>
            <IonToggle
              checked={settings.enableNotifications}
              onIonChange={e => {
                setSettings({
                  ...settings,
                  enableNotifications: e.target.checked,
                });
              }}
            />
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Settings;
