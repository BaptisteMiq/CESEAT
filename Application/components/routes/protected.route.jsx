import React from "react";
import { Redirect, Route } from "react-router-dom";
import api from "../api";

export const AuthRoute = ({ component: Component, roleId, accessWithoutAuth , ...rest }) => {

  var [isAuthenticated, setIsAuthenticated] = React.useState(null);
  var [user, setUser] = React.useState(null);
  var checkIfAuthenticated = async ( ) => {
    var response = await api('post', {
      query: `mutation IsLoggedIn {
        isLoggedIn {
          record {
            ID
            Role_ID
            Firstname
            Lastname
            Mail
            PhoneNumber
            Avatar
          }
          token
        }
      }`,
    }, '', "Utilisateur bien authentifié !", false);
  
    if(response.data.isLoggedIn) {
      setUser({...response.data.isLoggedIn.record});
      localStorage.setItem('RoleID', response.data.isLoggedIn.record.Role_ID);
      localStorage.setItem('authenticated', true);
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem('Token');
      localStorage.setItem('authenticated', false);
      setIsAuthenticated(false);
    }
  }

  React.useEffect(() => {
    checkIfAuthenticated();
  }, [isAuthenticated])
  console.log(user);
  return (
    <Route
      {...rest}
      render={(props) => {
        if (localStorage.getItem('authenticated') === 'true' && (roleId ? roleId.includes(parseInt(localStorage.getItem('RoleID'))) : true)) {
          return <Component {...props} user={user} {...rest}/>;
        } else if (accessWithoutAuth) {
            return <Component {...props} user={user} {...rest}/>;
        } else {
          return (
            <Redirect
              to={{
                pathname: "/users/login",
                state: {
                  from: props.location,
                },
              }}
            />
          );
        }
      }}
    />
  );
};
