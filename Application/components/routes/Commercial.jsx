import { IonHeader, IonIcon, IonLabel, IonPage, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, isPlatform } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { cart, home, person, search } from 'ionicons/icons';
import { Switch } from 'react-router-dom';
import ListUsers from '../pages/commercial/listUsers';
import Order from '../pages/delivery/order/Order';
import Menu from '../pages/Menu';
import { AuthRoute } from './protected.route';
import Dashboard from '../pages/commercial/dashboard';
import Statistique from '../pages/commercial/statistiques';
import { Route } from 'react-router-dom/cjs/react-router-dom.min';
import Footer from '../ui/FooterApp';

const Restaurants = (props) => {
  return (
    <div>
      {isPlatform('desktop') &&
        <IonPage>
          <IonHeader>
            <Menu user={props.user} type="commercial"/>
          </IonHeader>
          <div className='mt-14 overflow-y-auto'>
            <Switch>
              <AuthRoute path="/commercial/users/list" roleId={[4]} component={ListUsers} exact={true} />
              <AuthRoute path="/commercial/dashboard" roleId={[4]} component={Dashboard} exact={true} />
              <AuthRoute path="/commercial/statistique" roleId={[4]} component={Statistique} exact={true} />
              <Route path="/commercial/*" render={() => <Redirect to="/commercial/dashboard" />} exact={true} />
            </Switch>
          </div>
          <Footer></Footer>
        </IonPage>
      }
      { !isPlatform('desktop') && 
          <IonTabs>
          <IonRouterOutlet className='overflow-y-auto'>
            <Switch>
              <AuthRoute path="/delivery/orders" component={Order} exact={true} />
            </Switch>
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

export default Restaurants;
