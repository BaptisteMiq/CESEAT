import React from "react";
import { Redirect, Route } from "react-router-dom";
import api from "../api";

export const AuthRoute = ({ component: Component, accessWithoutAuth , ...rest }) => {

  var [isAuthenticated, setIsAuthenticated] = React.useState(null);
  var loading = false;

  var checkIfAuthenticated = async ( ) => {
    var response = await api('post', {
      query: `mutation IsLoggedIn {
        isLoggedIn {
          record {
            ID
            Role_ID
          }
          token
        }
      }`,
    }, '', "Utilisateur bien authentifié !", false);
  
    if(response.data.isLoggedIn) {
      localStorage.setItem('RoleID', response.data.isLoggedIn.record.Role_ID);
      localStorage.setItem('authenticated', true);
      setIsAuthenticated(true);
      loading = false;
    } else {
      localStorage.removeItem('Token');
      localStorage.removeItem('RoleID');
      localStorage.setItem('authenticated', false);
      setIsAuthenticated(false);
      loading = false;
    }
  }
  checkIfAuthenticated();
  return (
    <Route
      {...rest}
      render={(props) => {
        if (localStorage.getItem('authenticated') === 'true') {
          return <Component {...props} {...rest}/>;
        } else if (accessWithoutAuth) {
            return <Component {...props} {...rest}/>;
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
