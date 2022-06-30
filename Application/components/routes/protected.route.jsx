import React from "react";
import { Redirect, Route } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import api from "../api";

export const AuthRoute = ({ component: Component, roleId, accessWithoutAuth , ...rest }) => {

  var [isAuthenticated, setIsAuthenticated] = React.useState(null);
  var [user, setUser] = React.useState(null);
  var history = useHistory();
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
      localStorage.setItem('UserID', response.data.isLoggedIn.record.ID);
      localStorage.setItem('authenticated', true);
      setIsAuthenticated(true);
      // history.push()
    } else {
      localStorage.removeItem('Token');
      localStorage.setItem('authenticated', false);
      setIsAuthenticated(false);
    }
  }

  React.useEffect(() => {
    checkIfAuthenticated();
  }, [isAuthenticated])
  
  return (
    <Route
      {...rest}
      render={(props) => {
        if (localStorage.getItem('authenticated') === 'true' && (roleId ? roleId.includes(parseInt(localStorage.getItem('RoleID'))) : true)) {
          return isAuthenticated ? <Component {...props} user={user} {...rest}/> : <div></div>
        } else if (accessWithoutAuth) {
            return <Component {...props} user={user} {...rest}/>
        } else if (localStorage.getItem('authenticated') && (localStorage.getItem('RoleID') === "1")) {
          return <Redirect
            to={{
              pathname: "/users/home",
              state: {
                from: props.location
              },
            }}
          />
        } else if (localStorage.getItem('authenticated') && (localStorage.getItem("RoleID") === "2")) {
          return <Redirect
            to={{
              pathname: "/restaurant/orders",
              state: {
                from: props.location
              },
            }}
          />
        } 
        else if (localStorage.getItem('authenticated') && (localStorage.getItem("RoleID") === "2")) {
          return <Redirect
            to={{
              pathname: "/restaurant/orders",
              state: {
                from: props.location
              },
            }}
          />
        }
        
        else if(!localStorage.getItem('authenticated')){
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
