import { IonHeader, IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, isPlatform } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { cart, home, person, search } from 'ionicons/icons';
import { Route, Switch } from 'react-router-dom';
import Menu from '../pages/Menu';
import CreateProduct from '../pages/restaurant/products/CreatePoduct';
import ListProduct from '../pages/restaurant/products/ListProduct';
import Modify from '../pages/restaurant/products/ModifyProduct';
import CreateMenu from '../pages/restaurant/menus/CreateMenu';
import ListMenu from '../pages/restaurant/menus/ListMenu';
import ModifyMenu from '../pages/restaurant/menus/ModifyMenu';
import CreateRestaurant from '../pages/restaurant/CreateRestaurant';
import { AuthRoute } from './protected.route';
import api from '../api';
import React from 'react';
import Order from '../pages/restaurant/order/Order';

const Restaurants = (props) => {
  var [getRestaurant, setGetRestaurant] = React.useState(false);
  var checkRestaurant = async () => {
    var response = await api('post', {
        query: `query MyRestaurant {
          myRestaurant {
            _id
          }
        }`
    }, '', 'Le restaurant a bien été récupéré !', false);

    console.log(response.data);
    if(response.data.myRestaurant) {
      setGetRestaurant(true);
    }
  }

  React.useEffect(()=> {
    checkRestaurant();
  }, [getRestaurant])

  return (
    <div>
      {isPlatform('desktop') &&
        <IonReactRouter>
          <IonHeader>
            <Menu user={props.user} type="restaurant"/>
          </IonHeader>
          <IonRouterOutlet className='mt-14 overflow-y-auto'>
            <Switch>
              <AuthRoute path="/restaurant/create" roleId={[2]} component={CreateRestaurant} exact={true} />
              <AuthRoute path="/restaurant/product/create" roleId={[2]} component={CreateProduct} exact={true} />
              <AuthRoute path="/restaurant/product" roleId={[2]} component={ListProduct} exact={true} />
              <AuthRoute path="/restaurant/product/modify" roleId={[2]} component={Modify} exact={true} />
              <AuthRoute path="/restaurant/menu/create" roleId={[2]} component={CreateMenu} exact={true} />
              <AuthRoute path="/restaurant/menu" roleId={[2]} component={ListMenu} exact={true} />
              <AuthRoute path="/restaurant/menu/modify" roleId={[2]} component={ModifyMenu} exact={true} />
              <AuthRoute path="/restaurant/orders" roleId={[2]} component={Order} exact={true} />
            </Switch>
          </IonRouterOutlet>
        </IonReactRouter>
      }
      { !isPlatform('desktop') && 
          <IonTabs>
          <IonRouterOutlet className='overflow-y-auto'>
            <Switch>
              <AuthRoute path="/restaurant/create" roleId={[2]} component={CreateRestaurant} exact={true} />
              <AuthRoute path="/restaurant/product/create" roleId={[2]} component={CreateProduct} exact={true} />
              <AuthRoute path="/restaurant/product/modify" roleId={[2]} component={Modify} exact={true} />
              <AuthRoute path="/restaurant/product" roleId={[2]} component={ListProduct} exact={true} />
              <AuthRoute path="/restaurant/menu/create" roleId={[2]} component={CreateMenu} exact={true} />
              <AuthRoute path="/restaurant/menu" roleId={[2]} component={ListMenu} exact={true} />
              <AuthRoute path="/restaurant/menu/modify" roleId={[2]} component={ModifyMenu} exact={true} />
              <AuthRoute path="/restaurant/orders" roleId={[2]} component={Order} exact={true} />
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
