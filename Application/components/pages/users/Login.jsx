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
            placeholder: "Mail"
        },
        Password: {
            title: "Mot de passe",
            type: "PasswordInput",
            value: "",
            fullWidth: true,
            placeholder: "Mot de passe"
        }
    }
}


const Login = (props) => {
    var history = useHistory();
    var handleLogin = async (registerForms) => {

        alert("Login button clicked");

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
        
        if(response) {
            alert("Youpi ça marche", response.data.userLogin.token)
            localStorage.setItem('Token', response.data.userLogin.token);
            localStorage.setItem('authenticated', true);
            history.push('/users/home');
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
        <IonPage className="overflow-y-auto mb-5">
            <AutoForms dataForms={dataForms} setDataForms={setDataForms} buttons={buttons}></AutoForms>
        </IonPage>
    );
};

export default Login;
