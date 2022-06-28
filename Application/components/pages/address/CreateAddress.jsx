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
    title: "Ajouter une adresse",
    elements: {
        Line1: {
            title: "Adresse",
            type: "Input",
            value: "",
            fullWidth: true,
            placeholder: "Adresse",
            isValid: true
        },
        Line2: {
            title: "Complément d'adresse",
            type: "Input",
            value: "",
            fullWidth: true,
            placeholder: "Complément d'adresse",
            isValid: true
        },
        City: {
            title: "Ville",
            type: "Input",
            value: "",
            fullWidth: false,
            placeholder: "Ville",
            isValid: true
        },
        PC: {
            title: "Code Postal",
            type: "Input",
            value: "",
            fullWidth: false,
            placeholder: "Code Postal",
            isValid: true
        },
        Country: {
            title: "Pays",
            type: "Input",
            value: "",
            fullWidth: false,
            placeholder: "Pays",
            isValid: true
        }
    }
}


const CreateProduct = (props) => {
    let history = useHistory();
    var handleCreate = async (addressForms) => {
        var response = await api('post', {
            query: `mutation AddressCreateOne($record: CreateOneAddressInput!) {
                myAddressCreateOne(record: $record) {
                  record {
                    line1
                    line2
                    city
                    PC
                    country
                  }
                }
              }`,
            variables: `{
                "record": {
                    "line1": "${addressForms.elements.Line1.value}",
                    "line2": "${addressForms.elements.Line2.value}",
                    "city": "${addressForms.elements.City.value}",
                    "PC": "${addressForms.elements.PC.value}",
                    "country": "${addressForms.elements.Country.value}"
                }
            }`
        }, '', 'L\'adresse a bien été créé !', true);
    }
    var cancelButton = () => {
        history.goBack();
    }

    var buttonsModel = [
        {
            buttonlabel: "Retour",
            type: 'secondaire',
            function: cancelButton
        },
        {
            buttonlabel: "Créer l'adresse",
            type: 'primaire',
            function: handleCreate
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

export default CreateProduct;
