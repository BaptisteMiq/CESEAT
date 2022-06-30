import { IonHeader, IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, isPlatform } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { cart, home, person, search } from 'ionicons/icons';
import { Redirect, Route, Switch } from 'react-router-dom';
import HomePage from '../pages/Home';
import RestaurantDetails from '../pages/RestaurantDetails';
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
import Footer from '../ui/FooterApp';
import LegalMention from '../pages/LegalMention';

const Users = (props) => {
  console.log('tests');
  return (
    <div>
      {isPlatform('desktop') &&
        <div >
          <IonHeader style={{zIndex: 9999}}>
            <Menu user={props.user} type="users"/>
          </IonHeader>
          <div className='mt-24 top-12 overflow-y-auto'>
            <div></div>
            <Switch>
            <AuthRoute path="/users/home" component={HomePage} roleId={[1]} accessWithoutAuth={false} exact={true} />
              <AuthRoute path="/users/modify" component={Modify} roleId={[1, 2, 4]} accessWithoutAuth={false} exact={true} />
              <AuthRoute path="/users/address/create" component={CreateAddress} roleId={[1,2]} accessWithoutAuth={false} exact={true} />
              <AuthRoute path="/users/address" component={ListAddress} roleId={[1,2]} accessWithoutAuth={false} exact={true} />
              <AuthRoute path="/users/address/modify"component={ModifyAddress} roleId={[1,2]} accessWithoutAuth={false} exact={true} />
              <AuthRoute path="/users/cart" component={Cart} roleId={[1]} accessWithoutAuth={false} exact={true} />
              <AuthRoute path="/users/orders" component={Order} roleId={[1]} accessWithoutAuth={false} exact={true} />
              <AuthRoute path="/users/restaurant/details" component={RestaurantDetails} roleId={[1]} accessWithoutAuth={false} exact />
              <AuthRoute path="/users/register" component={CreateAccount} accessWithoutAuth={true} exact={true} />
              <AuthRoute path="/users/login" component={Login} accessWithoutAuth={true} exact={true} />
              <AuthRoute path="/users/legal-mentions" component={LegalMention} accessWithoutAuth={true} exact={true} />
              <Route path="/users/*" render={() => <Redirect to="/users/home" />} exact={true} />
            </Switch>
          </div>
          <Footer></Footer>
        </div>
      }
      { !isPlatform('desktop') && 
          <IonTabs>
          <IonRouterOutlet className='overflow-y-auto'>
            <Switch>
              <AuthRoute path="/users/home" component={HomePage} roleId={[1]} accessWithoutAuth={false} exact={true} />
              <AuthRoute path="/users/modify" component={Modify} roleId={[1,2]} accessWithoutAuth={false} exact={true} />
              <AuthRoute path="/users/list" component={ListUsers}  accessWithoutAuth={false} exact={true} />
              <AuthRoute path="/users/address/create" component={CreateAddress} roleId={[1,2]} accessWithoutAuth={false} exact={true} />
              <AuthRoute path="/users/address" component={ListAddress} roleId={[1,2]} accessWithoutAuth={false} exact={true} />
              <AuthRoute path="/users/address/modify"component={ModifyAddress} roleId={[1,2]} accessWithoutAuth={false} exact={true} />
              <AuthRoute path="/users/cart" component={Cart} roleId={[1]} accessWithoutAuth={false} exact={true} />
              <AuthRoute path="/users/orders" component={Order} roleId={[1]} accessWithoutAuth={false} exact={true} />
              <AuthRoute path="/users/restaurant/details" component={RestaurantDetails} roleId={[1]} accessWithoutAuth={false} exact />
              <AuthRoute path="/users/register" component={CreateAccount} accessWithoutAuth={true} exact={true} />
              <AuthRoute path="/users/login" component={Login} accessWithoutAuth={true} exact={true} />
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
