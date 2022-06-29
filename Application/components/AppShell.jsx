import { StatusBar, Style } from '@capacitor/status-bar';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import React, { useEffect, useState } from 'react';
import { ReactNotifications } from 'react-notifications-component';
import { Redirect, Route } from 'react-router-dom';
import { Switch } from 'react-router-dom/cjs/react-router-dom.min';
import socketIOClient from 'socket.io-client';
import Delivery from './routes/Delivery';
import history from './routes/history';
import { AuthRoute } from './routes/protected.route';
import Restaurants from './routes/Restaurants';
import Users from './routes/Users';

const socket = socketIOClient(process.env.NEXT_PUBLIC_SOCKET, {
  withCredentials: true
});
export const SocketContext = React.createContext(socket);

window.matchMedia('(prefers-color-scheme: dark)').addListener(async status => {
  try {
    await StatusBar.setStyle({
      style: status.matches ? Style.Dark : Style.Light,
    });
  } catch {}
});

const AppShell = () => {
  const [response, setResponse] = useState('');
  useEffect(() => {
  }, []);

  var roleID = localStorage.getItem('RoleID');
  return (
    <IonApp>
      <ReactNotifications />
      <SocketContext.Provider value={socket}>
        <IonReactRouter history={history}>
          <IonRouterOutlet id="main">
            <Switch>
              <AuthRoute path="/users" accessWithoutAuth={true} roleId={[0, 1, 2]} component={Users} />
              <AuthRoute path="/restaurant" accessWithoutAuth={false} roleId={[0, 2]} component={Restaurants} />
              <AuthRoute path="/delivery" accessWithoutAuth={false} roleId={[0, 3]} component={Delivery} />
            </Switch>
            <Route exact path="/" render={() => <Redirect to="/users" />} />
          </IonRouterOutlet>
        </IonReactRouter>
      </SocketContext.Provider>
    </IonApp>
  );
};

export default AppShell;
