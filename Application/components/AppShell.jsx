import { StatusBar, Style } from '@capacitor/status-bar';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import Users from './routes/Users';
import history from './routes/history';
import { ReactNotifications } from 'react-notifications-component';
import Restaurants from './routes/Restaurants';
import { AuthRoute } from './routes/protected.route';

window.matchMedia("(prefers-color-scheme: dark)").addListener(async (status) => {
  try {
    await StatusBar.setStyle({
      style: status.matches ? Style.Dark : Style.Light,
    });
  } catch {}
});

const AppShell = () => {
  return (
    <IonApp>
      <ReactNotifications />
      <IonReactRouter history={history}>
        <IonRouterOutlet id="main">
          <AuthRoute path="/users" accessWithoutAuth={true} component={Users} />
          <AuthRoute path="/restaurant" accessWithoutAuth={true} component={Restaurants} />
          <Route exact path="/" render={() => <Redirect to="/users" />} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default AppShell;
