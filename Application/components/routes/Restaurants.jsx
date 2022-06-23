import { IonHeader, IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, isPlatform } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { cart, home, person, search } from 'ionicons/icons';
import { Route, Switch } from 'react-router-dom';
import Menu from '../pages/Menu';
import CreateProduct from '../pages/restaurant/products/CreatePoduct';
import ListProduct from '../pages/restaurant/products/ListProduct';

const Restaurants = () => {
  return (
    <div>
      {isPlatform('desktop') &&
        <IonReactRouter>
          <IonHeader>
            <Menu type="restaurant"/>
          </IonHeader>
          <IonRouterOutlet className='mt-14 overflow-y-auto'>
            <Switch>
              <Route path="/restaurant/product/create" component={CreateProduct} exact={true} />
              <Route path="/restaurant/product" component={ListProduct} exact={true} />
            </Switch>
          </IonRouterOutlet>
        </IonReactRouter>
      }
      { !isPlatform('desktop') && 
          <IonTabs>
          <IonRouterOutlet className='overflow-y-auto'>
            <Switch>
              <Route path="/product/create" component={CreateProduct} exact={true} />
              <Route path="/restaurant/product" component={ListProduct} exact={true} />
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