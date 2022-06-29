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
import React, { useEffect } from 'react';
import Order from '../pages/restaurant/order/Order';
import { useHistory, useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import CreateCategory from '../pages/restaurant/categories/CreateCategory';
import ListCategory from '../pages/restaurant/categories/ListCategory';
import ModifyCategory from '../pages/restaurant/categories/ModifyCategory';
import ModifyRestaurant from '../pages/restaurant/ModifyRestaurant';

const Restaurants = (props) => {
  var history = useHistory();
  var checkRestaurant = async () => {
    var response = await api('post', {
        query: `query MyRestaurant {
          myRestaurant {
            _id
          }
        }`
    }, '', 'Le restaurant a bien été récupéré !', false);

    if(response.data.myRestaurant) {
      localStorage.setItem('ownRestaurant', true);
      localStorage.setItem('restaurantID', response.data.myRestaurant._id);
    } else {
      localStorage.setItem('ownRestaurant', false);
      history.push('/restaurant/create');
    }
  }
  useEffect(() => {
      checkRestaurant();
  }, [history.location.pathname])

  return (
    <div>
      {isPlatform('desktop') &&
        <div>
          <IonHeader style={{zIndex: 9999}}>
            <Menu user={props.user} history={history} type="restaurant"/>
          </IonHeader>
          <div className='mt-14 overflow-y-auto'>
              { localStorage.getItem('ownRestaurant') === "true" ? 
                <Switch>
                  <AuthRoute path="/restaurant/modify" roleId={[2]} component={ModifyRestaurant} exact={true} />
                  <AuthRoute path="/restaurant/product/create" roleId={[2]} component={CreateProduct} exact={true} />
                  <AuthRoute path="/restaurant/product" roleId={[2]} component={ListProduct} exact={true} />
                  <AuthRoute path="/restaurant/product/modify" roleId={[2]} component={Modify} exact={true} />
                  <AuthRoute path="/restaurant/menu/create" roleId={[2]} component={CreateMenu} exact={true} />
                  <AuthRoute path="/restaurant/menu" roleId={[2]} component={ListMenu} exact={true} />
                  <AuthRoute path="/restaurant/menu/modify" roleId={[2]} component={ModifyMenu} exact={true} />
                  <AuthRoute path="/restaurant/orders" roleId={[2]} component={Order} exact={true} />
                  <AuthRoute path="/restaurant/category/create" roleId={[2]} component={CreateCategory} exact={true} />
                  <AuthRoute path="/restaurant/category" roleId={[2]} component={ListCategory} exact={true} />
                  <AuthRoute path="/restaurant/category/modify" roleId={[2]} component={ModifyCategory} exact={true} />
                </Switch>  
               : <AuthRoute path="/restaurant/create" roleId={[2]} component={CreateRestaurant} exact={true} />
              }
          </div>
        </div>
      }
      { !isPlatform('desktop') && 
          <IonTabs>
          <IonRouterOutlet className='overflow-y-auto'>
            <Switch>
              <AuthRoute path="/restaurant/create" roleId={[2]} component={CreateRestaurant} exact={true} />
              <AuthRoute path="/restaurant/modify" roleId={[2]} component={ModifyRestaurant} exact={true} />
              <AuthRoute path="/restaurant/product/create" roleId={[2]} component={CreateProduct} exact={true} />
              <AuthRoute path="/restaurant/product/modify" roleId={[2]} component={Modify} exact={true} />
              <AuthRoute path="/restaurant/product" roleId={[2]} component={ListProduct} exact={true} />
              <AuthRoute path="/restaurant/menu/create" roleId={[2]} component={CreateMenu} exact={true} />
              <AuthRoute path="/restaurant/menu" roleId={[2]} component={ListMenu} exact={true} />
              <AuthRoute path="/restaurant/menu/modify" roleId={[2]} component={ModifyMenu} exact={true} />
              <AuthRoute path="/restaurant/orders" roleId={[2]} component={Order} exact={true} />
              <AuthRoute path="/restaurant/category/create" roleId={[2]} component={CreateCategory} exact={true} />
              <AuthRoute path="/restaurant/category" roleId={[2]} component={ListCategory} exact={true} />
              <AuthRoute path="/restaurant/category/modify" roleId={[2]} component={ModifyCategory} exact={true} />
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
