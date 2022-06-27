import { IonHeader, IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, isPlatform } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { cart, home, person, search } from 'ionicons/icons';
import { Redirect, Route, Switch } from 'react-router-dom';
import HomePage from '../pages/Home';
import ListDetail from '../pages/ListDetail';
import Lists from '../pages/Lists';
import Menu from '../pages/Menu';
import CreateAccount from '../pages/users/createAccount';
import ListUsers from '../pages/users/ListUsers';
import Login from '../pages/users/Login';
import Modify from '../pages/users/Modify';
import CreateAddress from '../pages/address/CreateAddress';
import ListAddress from '../pages/address/ListAddress';
import ModifyAddress from '../pages/address/ModifyAddress';
import Cart from '../pages/users/Cart';
import Order from '../pages/users/Order';
import { AuthRoute } from './protected.route';

const Users = () => {
  return (
    <div>
      {isPlatform('desktop') &&
        <IonReactRouter>
          <IonHeader>
            <Menu type="users"/>
          </IonHeader>
          <IonRouterOutlet className='mt-14 overflow-y-auto'>
            <Switch>
              <AuthRoute path="/users/home" accessWithoutAuth={false} component={HomePage} exact={true} />
              <AuthRoute path="/users/browse" accessWithoutAuth={false} component={Lists} exact={true} />
              <AuthRoute path="/users/browse/:listId" accessWithoutAuth={false} component={ListDetail} exact={true} />
              <AuthRoute path="/users/register" accessWithoutAuth={true} component={CreateAccount} exact={true} />
              <AuthRoute path="/users/login" accessWithoutAuth={true} component={Login} exact={true} />
              <AuthRoute path="/users/modify" accessWithoutAuth={false} component={Modify} exact={true} />
              <AuthRoute path="/users/list" component={ListUsers} accessWithoutAuth={false} exact={true} />
              <AuthRoute path="/users/address/create" component={CreateAddress} accessWithoutAuth={false} exact={true} />
              <AuthRoute path="/users/address" component={ListAddress} accessWithoutAuth={false} exact={true} />
              <AuthRoute path="/users/address/modify" component={ModifyAddress} accessWithoutAuth={false} exact={true} />
              <AuthRoute path="/users/cart" component={Cart} accessWithoutAuth={false} exact={true} />
              <AuthRoute path="/users/orders" component={Order} accessWithoutAuth={false} exact={true} />
              <Route path="/users" render={() => <Redirect to="/users/home" />} exact={true} />
            </Switch>
          </IonRouterOutlet>
        </IonReactRouter>
      }
      { !isPlatform('desktop') && 
          <IonTabs>
          <IonRouterOutlet className='overflow-y-auto'>
            <Switch>
              <AuthRoute path="/users/home" component={HomePage} accessWithoutAuth={false} exact={true} />
              <AuthRoute path="/users/browse" component={Lists} accessWithoutAuth={false} exact={true} />
              <AuthRoute path="/users/browse/:listId" component={ListDetail} accessWithoutAuth={false} exact={true} />
              <AuthRoute path="/users/register" component={CreateAccount} accessWithoutAuth={true} exact={true} />
              <AuthRoute path="/users/login" component={Login} accessWithoutAuth={true} exact={true} />
              <AuthRoute path="/users/modify" component={Modify} accessWithoutAuth={false} exact={true} />
              <AuthRoute path="/users/list" component={ListUsers} accessWithoutAuth={false} exact={true} />
              <AuthRoute path="/users/address/create" component={CreateAddress} accessWithoutAuth={false} exact={true} />
              <AuthRoute path="/users/address" component={ListAddress} accessWithoutAuth={false} exact={true} />
              <AuthRoute path="/users/address/modify"component={ModifyAddress} accessWithoutAuth={false} exact={true} />
              <AuthRoute path="/users/cart" component={Cart} accessWithoutAuth={false} exact={true} />
              <AuthRoute path="/users/orders" component={Order} accessWithoutAuth={false} exact={true} />
              <Route path="/users" render={() => <Redirect to="/users/home" />} exact={true} />
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

export default Users;
