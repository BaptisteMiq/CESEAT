import { IonPage } from "@ionic/react";
import axios from "axios";
import * as React from 'react';
import AutoForms from "../../ui/AutoForms";
import { useHistory  } from "react-router-dom";
import api from "../../api";
// title = Permet d'afficher le nom de l'input
// type = Permet de choisir letype d'input : ['UploadFile','Input','MailInput','PasswordInput','PhoneInput', 'Image']
// fullWidth = Permet de chosir si l'input doit être en full largeur ou non [true, false]
// confirm = Permet de mentionner un tag pour vérifier la bonne saisie de l'information
// placeholder = Permet d'afficher le texte à saisir
// Flag array avec un label, id du pays et le dialcode
var generateModal = {
    title: "S'inscrire",
    elements: {
        UploadFile: {
            title: 'File Upload',
            type: 'UploadFile',
            fullWidth: false,
            value: ''
        },
        Image: {
            title: 'Avatar',
            src: "https://institutcoop.hec.ca/es/wp-content/uploads/sites/3/2020/02/Deafult-Profile-Pitcher.png",
            type: "Image",
            fullWidth: false
        },
        Firstname: {
            title: "Prénom",
            type: "Input",
            value: "",
            fullWidth: false,
            placeholder: "Prénom",
            isValid: true
        },
        Lastname: {
            title: "Nom",
            type: "Input",
            value: "",
            fullWidth: false,
            placeholder: "Nom",
            isValid: true
        },
        Mail: {
            title: "Mail",
            type: "MailInput",
            value: "",
            fullWidth: false,
            placeholder: "Mail",
            isValid: true
        },
        ConfirmMail: {
            title: "Confirmer mail",
            type: "MailInput",
            value: "",
            confirm: "Mail",
            fullWidth: false,
            placeholder: "Confirmer mail",
            isValid: true,
            isConfirm: false
        },
        Password: {
            title: "Mot de passe",
            type: "PasswordInput",
            value: "",
            fullWidth: false,
            placeholder: "Mot de passe",
            isValid: true
        },
        ConfirmPassword: {
            title: "Confirmer mot de passe",
            type: "PasswordInput",
            value: "",
            confirm: "Password",
            fullWidth: false,
            placeholder: "Confirmer mot de passe",
            isValid: true,
            isConfirm: false
        },
        RoleSelect: {
            title: "Sélectionner le type de compte",
            type: "SelectInput",
            value: [{ label: "Utilisateur", id: "1"}],
            options: [{label: "Utilisateur", id: "1"}, {label: "Restaurateur", id: "2"}, {label: "Livreur", id: "3"}, {label: "Commercial", id: "4"}, {label: "Développeur", id: "5"}],
            fullWidth: true,
            multi: false,
            placeholder: ""
        },
        PhoneNumber: {
            title: "Numéro de téléphone",
            type: "PhoneInput",
            flag: {label: 'France', id: 'FR', dialCode: '+33'},
            fullWidth: false,
            value: "",
            isValid: true
        }
    }
}


const CreateAccount = (props) => {
    let history = useHistory();
    var handleRegister = async (registerForms) => {
        var response = await api('post', {
            query: `mutation UserCreateOne($record: UserCreateInput) {
                userCreateOne(record: $record) {
                    record {
                        ID
                        Role_ID
                    }
                    token
                }
            }`,
            variables: `{
                "record": {
                    "Firstname": "${registerForms.elements.Firstname.value}",
                    "Lastname": "${registerForms.elements.Lastname.value}",
                    "Password": "${registerForms.elements.Password.value}",
                    "Mail": "${registerForms.elements.Mail.value}",
                    "PhoneNumber": "${registerForms.elements.PhoneNumber.value}",
                    "Role_ID": "${registerForms.elements.RoleSelect.value[0].id}",
                    "Avatar": null
                }
            }`
        }, '', 'Le compte utilisateur a bien été créé !', true);

        
        if(response) {
            localStorage.setItem('Token', response.data.userCreateOne.token);
            localStorage.setItem('authenticated', true);
            if(response.data.userCreateOne.record.Role_ID === "1") {
                history.push('/users/home');
                history.go(0);
            } else if(response.data.userCreateOne.record.Role_ID === "2"){
                if(localStorage.getItem('ownRestaurant') === "true") {
                    history.push('/restaurant/orders');
                    history.go(0);
                } else {
                    history.push('/restaurant/create');
                    history.go(0);
                }
            } else if(response.data.userCreateOne.record.Role_ID === "3"){
                history.push('/delivery/orders');
                history.go(0);
            } else if(response.data.userCreateOne.record.Role_ID === "4") {
                history.push('/commercial/dashboard');
                history.go(0);
            }
        }
    }
    var loginButton = () => {
        history.push('/users/login');
    }

    var buttonsModel = [
        {
            buttonlabel: "Déja inscrit ?",
            type: 'tertiaire',
            function: loginButton
        },
        {
            buttonlabel: "S'inscrire",
            type: 'primaire',
            function: handleRegister
        }
    ]

    var [dataForms, setDataForms] = React.useState(generateModal);
    var [buttons, setButtons] = React.useState(buttonsModel);

    return (
        <IonPage className="top-14 mb-20 overflow-y-auto mb-5">
            <AutoForms dataForms={dataForms} setDataForms={setDataForms} buttons={buttons}></AutoForms>
        </IonPage>
    );
};

export default CreateAccount;
