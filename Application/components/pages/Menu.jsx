import {
  IonButton, IonButtons, IonIcon
} from '@ionic/react';
import { Avatar } from "baseui/avatar";
import { StatefulPopover, PLACEMENT, TRIGGER_TYPE } from "baseui/popover";
import {
  ALIGN, HeaderNavigation, StyledNavigationItem, StyledNavigationList
} from "baseui/header-navigation";
import { StyledLink } from "baseui/link";
import { notificationsOutline } from 'ionicons/icons';
import * as React from "react";
import { useState, useEffect } from 'react';
import { useHistory  } from "react-router-dom";
import Notifications from './Notifications';
import UserPopup from './users/UserPopup';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';

var user = {
  name: "Baptiste Miquel",
  avatarUrl: "https://www.clickwallpapers.net/wp-content/uploads/2022/02/clickwallpapers-wallpaper-nature-8k-resolution-img_23-scaled.jpg"
}
// Affichage du menu par rapport au rôle de l'utilisateur TODO : Le link avec l'authentification
var typeUser = "users";
var navigationByUsers = {
  users: [
    {
      label: "Accueil",
      link: "/users/home"
    },
    {
      label: "Parcourir",
      link: "/users/browse"
    },
    {
      label: "Panier",
      link: "/users/cart"
    }
  ],
  restaurant: [
    {
      label: "Nouvelle Commande",
      link: "/users/home"
    },
    {
      label: "Commande en cours",
      link: "/users/browse"
    },
    {
      label: "Commande prête",
      link: "/users/cart"
    },
    {
      label: "Paramètre restaurant",
      link: "/users/cart"
    }
  ],
  deliveryMan: {

  }
}

const Menu = () => {
  let history = useHistory();
  const [showNotifications, setShowNotifications] = useState(false);
  return (
      <HeaderNavigation className="">
        <Notifications open={showNotifications} onDidDismiss={() => setShowNotifications(false)} />
        <StyledNavigationList $align={ALIGN.left}>
          <StyledNavigationItem className="font-bold text-xl">CES&apos;EAT</StyledNavigationItem>
        </StyledNavigationList>
        <StyledNavigationList $align={ALIGN.center}>
          { navigationByUsers[typeUser].map(navigationItem => (
            <StyledNavigationItem key={navigationItem.label} className="mr-12 ml-6">
              <StyledLink href={navigationItem.link} animateUnderline onClick={(e) => {
                history.push(navigationItem.link);
                e.preventDefault();
                <Redirect to={navigationItem.link}></Redirect>
              }}>
                {navigationItem.label}
              </StyledLink>
            </StyledNavigationItem>
          )) }
        </StyledNavigationList>
        <StyledNavigationList $align={ALIGN.left}>
          <IonButtons slot="end" style={{ paddingRight: "10px"}} >
            <IonButton onClick={() => setShowNotifications(true)}>
              <IonIcon icon={notificationsOutline} />
            </IonButton>
          </IonButtons>
          <StatefulPopover
            content={() => (
             <UserPopup user={user}/>
            )}
            placement={PLACEMENT.leftTop}
            triggerType={TRIGGER_TYPE.hover}
          >
            <IonButtons slot="end" style={{ paddingRight: "20px"}}>
                <Avatar
                  name={user.name}
                  size="scale900"
                  src={user.avatarUrl}
                >
                </Avatar>
            </IonButtons>
          </StatefulPopover>
        </StyledNavigationList>
      </HeaderNavigation>
  );
}

export default Menu;