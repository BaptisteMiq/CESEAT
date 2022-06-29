import { StatusBar, Style } from '@capacitor/status-bar';
import { IonApp, IonHeader, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import Users from './routes/Users';
import history from './routes/history';
import { ReactNotifications } from 'react-notifications-component';
import Restaurants from './routes/Restaurants';
import Delivery from './routes/Delivery';
import { AuthRoute } from './routes/protected.route';
import Menu from './pages/Menu';
import socketIOClient from 'socket.io-client';
import React, { useEffect, useState } from 'react';
import { newNotification } from './ui/Notifs';

const socket = socketIOClient(`http://${process.env.NEXT_PUBLIC_MDW_HOST}:${process.env.NEXT_PUBLIC_MDW_PORT}/graphql`);
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
            <AuthRoute path="/users" accessWithoutAuth={true} roleId={[1, 2]} component={Users} />
            <AuthRoute path="/restaurant" accessWithoutAuth={false} roleId={[2]} component={Restaurants} />
            <Route path="/delivery" component={Delivery} />
            <Route exact path="/" render={() => <Redirect to="/users" />} />
          </IonRouterOutlet>
        </IonReactRouter>
      </SocketContext.Provider>
    </IonApp>
  );
};

export default AppShell;
