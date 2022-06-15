import { Redirect, Route } from 'react-router-dom';
import { IonRouterOutlet, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonHeader, isPlatform  } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { home, search, cart, person } from 'ionicons/icons';
import Menu from '../pages/Menu';
import HomePage from '../pages/Home';
import Lists from '../pages/Lists';
import ListDetail from '../pages/ListDetail';
import Settings from '../pages/Settings';

const Tabs = () => {
  return (
    <div>
      {isPlatform('desktop') &&
        <IonReactRouter>
          <IonHeader>
            <Menu />
          </IonHeader>
          <IonRouterOutlet className='mt-14 overflow-y-auto'>
            <Route path="/users/home" component={HomePage} exact={true} />
            <Route path="/users/browse" component={Lists} exact={true} />
            <Route path="/users/browse/:listId" component={ListDetail} exact={true} />
            <Route path="/users/settings" component={Settings} exact={true} />
            <Route path="/users" render={() => <Redirect to="/users/home" />} exact={true} />
          </IonRouterOutlet>
        </IonReactRouter>
      }
      { !isPlatform('desktop') && 
          <IonTabs>
          <IonRouterOutlet className='overflow-y-auto'>
            <Route path="/users/home" component={HomePage} exact={true} />
            <Route path="/users/browse" component={Lists} exact={true} />
            <Route path="/users/browse/:listId" component={ListDetail} exact={true} />
            <Route path="/users/settings" component={Settings} exact={true} />
            <Route path="/users" render={() => <Redirect to="/users/home" />} exact={true} />
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="tab1" href="/users/home">
              <IonIcon icon={home} />
              <IonLabel>Accueil</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tab2" href="/users/browse">
              <IonIcon icon={search} />
              <IonLabel>Parcourir</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tab3" href="/users/cart">
              <IonIcon icon={cart} />
              <IonLabel>Paniers</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tab4" href="/users/settings">
              <IonIcon icon={person} />
              <IonLabel>Compte</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      }
    </div>
  );
};

export default Tabs;
