import { StatusBar, Style } from '@capacitor/status-bar';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import Users from './routes/Users';
import history from './routes/history';
import { ReactNotifications } from 'react-notifications-component';
import Restaurants from './routes/Restaurants';

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
          <Route path="/users" render={() => <Users history={history} />} />
          <Route path="/restaurant" render={() => <Restaurants history={history} />} />
          <Route exact path="/" render={() => <Redirect to="/users" />} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default AppShell;
