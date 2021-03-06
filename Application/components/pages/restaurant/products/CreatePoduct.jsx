import { IonPage } from "@ionic/react";
import axios from "axios";
import * as React from 'react';
import AutoForms from "../../../ui/AutoForms";
import { useHistory  } from "react-router-dom";
import api from "../../../api";
import { defaultImage } from "../../../ui/Images";

// title = Permet d'afficher le nom de l'input
// type = Permet de choisir letype d'input : ['UploadFile','Input','PasswordInput','PhoneInput']
// fullWidth: Permet de chosir si l'input doit être en full largeur ou non [true, false]
// placeholder = Permet d'afficher le texte à saisir
// Flag array avec un label, id du pays et le dialcode
var generateModal = {
    title: "Créer un produit",
    elements: {
        UploadFile: {
            title: 'File Upload',
            type: 'UploadFile',
            fullWidth: false,
            value: ''
        },
        Image: {
            title: 'Image',
            src: defaultImage,
            type: "Image",
            fullWidth: false
        },
        Name: {
            title: "Nom du produit",
            type: "Input",
            value: "",
            fullWidth: false,
            placeholder: "Nom",
            isValid: true
        },
        Description: {
            title: "Description",
            type: "Input",
            value: "",
            fullWidth: false,
            placeholder: "Description",
            isValid: true
        },
        Price: {
            title: "Prix",
            type: "Input",
            value: "",
            fullWidth: false,
            placeholder: "0",
            isValid: true
        },
        AllergenicIngredients: {
            title: "Ingrédients allergènes",
            type: "Input",
            value: "",
            fullWidth: false,
            placeholder: "Ingrédients allergènes",
            isValid: true
        }
    }
}


const CreateProduct = (props) => {
    let history = useHistory();
    var handleCreate = async (productForms) => {
        var response = await api('post', {
            query: `mutation AddProductToMyRestaurant ($record: CreateOneProductInput!) {
                addProductToMyRestaurant (record: $record) {
                  recordId
                }
              }`,
            variables: `{
                "record": {
                    "name": "${productForms.elements.Name.value}",
                    "description": "${productForms.elements.Description.value}",
                    "price": ${productForms.elements.Price.value},
                    "allergenicIngredients": "${productForms.elements.AllergenicIngredients.value}",
                    "picture": "${productForms.elements.Image.src ?? defaultImage}",
                    "available": true
                }
            }`
        }, '', 'Le produit a bien été créé !', true);
        history.push('/restaurant/product');
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
            buttonlabel: "Créer le produit",
            type: 'primaire',
            function: handleCreate
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

export default CreateProduct;
