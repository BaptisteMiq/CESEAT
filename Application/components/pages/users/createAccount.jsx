import { IonPage } from "@ionic/react";
import axios from "axios";
import * as React from 'react';
import AutoForms from "../../ui/AutoForms";

// title = Permet d'afficher le nom de l'input
// type = Permet de choisir letype d'input : ['UploadFile','Input','PasswordInput','PhoneInput']
// fullWidth: Permet de chosir si l'input doit être en full largeur ou non [true, false]
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
            title: 'Image',
            src: "https://www.lamontagne.fr/photoSRC/Gw--/tour-de-ville_4162444.jpeg",
            type: "Image",
            fullWidth: false
        },
        Firstname: {
            title: "Prénom",
            type: "Input",
            value: "",
            fullWidth: false,
            placeholder: "Prénom"
        },
        Lastname: {
            title: "Nom",
            type: "Input",
            value: "",
            fullWidth: false,
            placeholder: "Nom"
        },
        Mail: {
            title: "Mail",
            type: "Input",
            value: "",
            fullWidth: false,
            placeholder: "Mail"
        },
        ConfirmMail: {
            title: "Confirmer mail",
            type: "Input",
            value: "",
            fullWidth: false,
            placeholder: "Confirmer mail"
        },
        Password: {
            title: "Mot de passe",
            type: "PasswordInput",
            value: "",
            fullWidth: false,
            placeholder: "Mot de passe"
        },
        ConfirmPassword: {
            title: "Confirmer mot de passe",
            type: "PasswordInput",
            value: "",
            fullWidth: false,
            placeholder: "Confirmer mot de passe"
        },
        PhoneNumber: {
            title: "Numéro de téléphone",
            type: "PhoneInput",
            flag: {label: 'France', id: 'FR', dialCode: '+33'},
            fullWidth: false,
            value: ""
        }
    }
}


const CreateAccount = (props) => {

    var handleRegister = (test) => {
        console.log(test)
    }
    var button = () => {
        console.log('tata');
    }
    var buttonsModel = [
        {
            buttonlabel: "Se connecter",
            type: 'tertiaire',
            function: handleRegister
        },
        {
            buttonlabel: "S'inscrire",
            type: 'primaire',
            function: button
        },
        {
            buttonlabel: "S'inscrire",
            type: 'primaire',
            function: button
        }
    ]

    var [dataForms, setDataForms] = React.useState(generateModal);
    var [buttons, setButtons] = React.useState(buttonsModel);
    // axios({
    //     url: 'http://localhost:4000/graphql',
    //     method: 'post',
    //     data: {
    //       query: `
    //         query getUsers {
    //           users
    //           }
    //         `
    //     }
    //   }).then((result) => {
    //     console.log(result.data);
    //   });

    return (
        <IonPage className="overflow-y-auto mb-5">
            <AutoForms dataForms={dataForms} setDataForms={setDataForms} buttons={buttons}></AutoForms>
        </IonPage>
    );
};

export default CreateAccount;
