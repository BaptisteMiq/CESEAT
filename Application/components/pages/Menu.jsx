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
import { Button, SHAPE, SIZE } from 'baseui/button';
import { defaultUserImage } from '../ui/Images';

var user = {
  name: "Baptiste Miquel",
  avatarUrl: "https://www.clickwallpapers.net/wp-content/uploads/2022/02/clickwallpapers-wallpaper-nature-8k-resolution-img_23-scaled.jpg"
}
// Affichage du menu par rapport au rôle de l'utilisateur TODO : Le link avec l'authentification
var navigationByUsers = {
  visitor: [],
  users: [
    {
      label: "Accueil",
      link: "/users/home"
    },
    {
      label: "Panier",
      link: "/users/cart"
    },
    {
      label: 'Commandes',
      link: '/users/orders'
    },
  ],
  restaurant: [
    {
      label: "Commande",
      link: "/restaurant/orders"
    },
    {
      label: "Catégorie",
      link: "/restaurant/category"
    },
    {
      label: "Menu",
      link: "/restaurant/menu"
    },
    {
      label: "Produit",
      link: "/restaurant/product"
    },
    {
      label: "Paramètre restaurant",
      link: "/restaurant/modify"
    }
  ],
  deliveryMan: [
    {
      label: "Commandes",
      link: "/delivery/orders"
    }
  ],
  commercial: [
    {
      label: 'Dashboard',
      link: '/commercial/dashboard'
    },
    {
      label: 'Liste',
      link: '/commercial/users/list'
    },
    {
      label: 'Statistique',
      link: '/commercial/statistique'
    }
  ]
}

const Menu = (props) => {
  var [typeUser, setTypeUser] = React.useState('users');
  var [roleID, setRoleId] = React.useState(0);
  if (roleID != localStorage.getItem('RoleID')) {
    setRoleId(localStorage.getItem('RoleID'));
  }
  var setType = () => {
    switch (localStorage.getItem('RoleID')) {
      case '0':
        setTypeUser('visitor');
        break;
      case '1':
        setTypeUser('users');
        break;
      case '2':
        setTypeUser('restaurant');
        break;
      case '3':
        setTypeUser('deliveryMan');
        break;
      case '4':
        setTypeUser('commercial');
        break;
      default:
        break;
    }
  }
  let history = useHistory();
  const [showNotifications, setShowNotifications] = useState(false);

  React.useEffect(() => {
    setType();
  }, [typeUser, roleID])
  return (
      <HeaderNavigation className="max-h-16">
        <Notifications open={showNotifications} onDidDismiss={() => setShowNotifications(false)} />
        <StyledNavigationList $align={ALIGN.left}>
          <StyledNavigationItem className="font-bold text-xl">CES&apos;EAT</StyledNavigationItem>
        </StyledNavigationList>
        <StyledNavigationList $align={ALIGN.center}>
          { navigationByUsers[typeUser].map(navigationItem => (
            <StyledNavigationItem key={navigationItem.label} className="mr-12 ml-6">
              <StyledLink href={navigationItem.link} animateUnderline onClick={(e) => {
                if(localStorage.getItem('RoleID') === "2" && localStorage.getItem('ownRestaurant') !== "true") {
                  props.history.push(navigationItem.link);
                } else {
                  history.push(navigationItem.link);
                }
                e.preventDefault();
                <Redirect to={navigationItem.link}></Redirect>
              }}>
                {navigationItem.label}
              </StyledLink>
            </StyledNavigationItem>
          )) }
        </StyledNavigationList>
        <StyledNavigationList $align={ALIGN.left}>
          { props.user ? (
            <div className='flex'>
              <IonButtons slot="end" style={{ paddingRight: "10px"}} >
                <IonButton onClick={() => setShowNotifications(true)}>
                  <IonIcon icon={notificationsOutline} />
                </IonButton>
              </IonButtons>
              <StatefulPopover
                content={() => (
                <UserPopup user={props.user}/>
                )}
                placement={PLACEMENT.leftTop}
                triggerType={TRIGGER_TYPE.hover}
              >
                <IonButtons slot="end" style={{ paddingRight: "20px"}}>
                    <Avatar
                      name={props.user.Firstname + " " + props.user.Lastname}
                      size="scale900"
                      src={process.env.NEXT_PUBLIC_CDN + (props.user.Avatar ?? defaultUserImage)}
                    >
                    </Avatar>
                </IonButtons>
              </StatefulPopover>
            </div>) :
            <div>
              <Button
                onClick={() => (history.push('/users/register'))}
                shape={SHAPE.pill}
                size={SIZE.compact}
                className="mx-2"
                kind='secondary'
                >
                S'inscrire
              </Button>
              <Button
                onClick={() => (history.push('/users/login'))}
                shape={SHAPE.pill}
                size={SIZE.compact}
                className="mx-2"
                kind='primary'
                >
                Se connecter
              </Button>
            </div> }
        </StyledNavigationList>
      </HeaderNavigation>
  );
}

export default Menu;