import { IonHeader, IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, isPlatform } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { cart, home, person, search } from 'ionicons/icons';
import { Switch } from 'react-router-dom';
import { Route } from 'react-router-dom/cjs/react-router-dom.min';
import Order from '../pages/delivery/order/Order';
import Menu from '../pages/Menu';
import Footer from '../ui/FooterApp';
import { AuthRoute } from './protected.route';

const Restaurants = (props) => {
  return (
    <div>
      {isPlatform('desktop') &&
        <div>
          <IonHeader>
            <Menu user={props.user} type="orders"/>
          </IonHeader>
          <div className='mt-14 overflow-y-auto'>
            <Switch>
              <AuthRoute path="/delivery/orders" component={Order} exact={true} />
              <Route path="/delivery/*" render={() => <Redirect to="/delivery/orders" />} exact={true} />
            </Switch>
          </div>
          <Footer></Footer>
        </div>
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
