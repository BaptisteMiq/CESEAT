import { StatusBar, Style } from '@capacitor/status-bar';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import Users from './routes/Users';
import history from './routes/history';
import { ReactNotifications } from 'react-notifications-component';
import Restaurants from './routes/Restaurants';
import Delivery from './routes/Delivery';
import { AuthRoute } from './routes/protected.route';
import socketIOClient from 'socket.io-client';
import React, { useEffect, useState } from 'react';
import { newNotification } from './ui/Notifs';

const socket = socketIOClient(`https://baptistemiq-ceseat-p57444qrh9474-4700.githubpreview.dev/`, {
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
            <Route path="/users" component={Users} />
            <Route path="/restaurant" component={Restaurants} />
            <Route path="/delivery" component={Delivery} />
            <Route exact path="/" render={() => <Redirect to="/users" />} />
          </IonRouterOutlet>
        </IonReactRouter>
      </SocketContext.Provider>
    </IonApp>
  );
};

export default AppShell;
