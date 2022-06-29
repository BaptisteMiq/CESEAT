import { IonPage } from "@ionic/react";
import axios from "axios";
import * as React from 'react';
import AutoForms from "../../ui/AutoForms";
import { useHistory  } from "react-router-dom";
import api from "../../api";

// title = Permet d'afficher le nom de l'input
// type = Permet de choisir letype d'input : ['UploadFile','Input','PasswordInput','PhoneInput']
// fullWidth: Permet de chosir si l'input doit être en full largeur ou non [true, false]
// placeholder = Permet d'afficher le texte à saisir
// Flag array avec un label, id du pays et le dialcode
var generateModal = {
    title: "Se connecter",
    elements: {
        Mail: {
            title: "Mail",
            type: "Input",
            value: "",
            fullWidth: true,
            placeholder: "Mail",
            isValid: true
        },
        Password: {
            title: "Mot de passe",
            type: "PasswordInput",
            value: "",
            fullWidth: true,
            placeholder: "Mot de passe",
            isValid: true
        }
    }
}


const Login = (props) => {
    var history = useHistory();
    if(localStorage.getItem('authenticated') === "true") {
        if(localStorage.getItem('RoleID') === "1") {
            history.push('/users/home');
        } else if(localStorage.getItem('RoleID') === "2"){
            history.push('/restaurant/orders');
        } else if(localStorage.getItem('RoleID') === "3"){
            history.push('/delivery/orders');
        }
    }
    var handleLogin = async (registerForms) => {

        var response = await api('post', {
            query: `mutation UserLogin($mail: String, $password: String) {
                userLogin(Mail: $mail, Password: $password) {
                  token
                  record {
                    ID
                    Role_ID
                  }
                }
              }`,
            variables: `{
                "password": "${registerForms.elements.Password.value}",
                "mail": "${registerForms.elements.Mail.value}"
            }`
        }, '', 'Le compte utilisateur est bien connecté !', true);
        if(response.data.userLogin) {
            localStorage.setItem('Token', response.data.userLogin.token);
            localStorage.setItem('authenticated', true);
            if(response.data.userLogin.record.Role_ID === "1") {
                history.push('/users/home');
                history.go(0);
            } else if(response.data.userLogin.record.Role_ID === "2"){
                if(localStorage.getItem('ownRestaurant') === "true") {
                    history.push('/restaurant/orders');
                    history.go(0);
                } else {
                    history.push('/restaurant/create');
                    history.go(0);
                }
            } else if(response.data.userLogin.record.Role_ID === "3"){
                history.push('/delivery/orders');
                history.go(0);
            }
        }
    }
    var registerButton = () => {
        history.push('/users/register');
    }
    var buttonsModel = [
        {
            buttonlabel: "S'inscrire",
            type: 'tertiaire',
            function: registerButton
        },
        {
            buttonlabel: "Se connecter",
            type: 'primaire',
            function: handleLogin
        }
    ]

    var [dataForms, setDataForms] = React.useState(generateModal);
    var [buttons, setButtons] = React.useState(buttonsModel);

    return (
        <IonPage className="top-14 overflow-y-auto mb-5">
            <AutoForms dataForms={dataForms} setDataForms={setDataForms} buttons={buttons}></AutoForms>
        </IonPage>
    );
};

export default Login;
