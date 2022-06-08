import { Redirect, Route } from 'react-router-dom';
import { IonRouterOutlet, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { home, search, cart, person } from 'ionicons/icons';

import HomePage from './Feed';
import Lists from './Lists';
import ListDetail from './ListDetail';
import Settings from './Settings';

const Tabs = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route path="/tabs/home" component={HomePage} exact={true} />
        <Route path="/tabs/lists" component={Lists} exact={true} />
        <Route path="/tabs/lists/:listId" component={ListDetail} exact={true} />
        <Route path="/tabs/settings" component={Settings} exact={true} />
        <Route path="/tabs" render={() => <Redirect to="/tabs/home" />} exact={true} />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="tab1" href="/tabs/home">
          <IonIcon icon={home} />
          <IonLabel>Accueil</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab2" href="/tabs/lists">
          <IonIcon icon={search} />
          <IonLabel>Parcourir</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab3" href="/tabs/toto">
          <IonIcon icon={cart} />
          <IonLabel>Paniers</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab4" href="/tabs/settings">
          <IonIcon icon={person} />
          <IonLabel>Compte</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default Tabs;
