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
              <Route path="/users/home" component={HomePage} exact={true} />
              <Route path="/users/browse" component={Lists} exact={true} />
              <Route path="/users/browse/:listId" component={ListDetail} exact={true} />
              <Route path="/users/register" component={CreateAccount} exact={true} />
              <Route path="/users/login" component={Login} exact={true} />
              <Route path="/users/modify" render={(props) => <Modify {...props} />} exact={true} />
              <Route path="/users/list" component={ListUsers} exact={true} />
              <Route path="/users/address/create" component={CreateAddress} exact={true} />
              <Route path="/users/address" component={ListAddress} exact={true} />
              <Route path="/users/address/modify" render={(props) => <ModifyAddress {...props} />} exact={true} />
              <Route path="/users" render={() => <Redirect to="/users/home" />} exact={true} />
            </Switch>
          </IonRouterOutlet>
        </IonReactRouter>
      }
      { !isPlatform('desktop') && 
          <IonTabs>
          <IonRouterOutlet className='overflow-y-auto'>
            <Switch>
              <Route path="/users/home" component={HomePage} exact={true} />
              <Route path="/users/browse" component={Lists} exact={true} />
              <Route path="/users/browse/:listId" component={ListDetail} exact={true} />
              <Route path="/users/register" component={CreateAccount} exact={true} />
              <Route path="/users/login" component={Login} exact={true} />
              <Route path="/users/modify" render={(props) => <Modify {...props} />} exact={true} />
              <Route path="/users/list" component={ListUsers} exact={true} />
              <Route path="/users/address/create" component={CreateAddress} exact={true} />
              <Route path="/users/address" component={ListAddress} exact={true} />
              <Route path="/users/address/modify" render={(props) => <ModifyAddress {...props} />} exact={true} />
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
