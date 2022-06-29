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


const CreateRestaurant = (props) => {
    let history = useHistory();
    var [getTypes, setGetTypes] = React.useState(true);
    var generateModal = {
        title: "Créer un restaurant",
        elements: {
            UploadFile: {
                title: 'File Upload',
                type: 'UploadFile',
                fullWidth: false,
                value: ''
            },
            Image: {
                title: 'Image',
                src: "https://institutcoop.hec.ca/es/wp-content/uploads/sites/3/2020/02/Deafult-Profile-Pitcher.png",
                type: "Image",
                fullWidth: false
            },
            Name: {
                title: "Nom du restaurant",
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
            Mail: {
                title: "Mail",
                type: "MailInput",
                value: "",
                fullWidth: false,
                placeholder: "Mail",
                isValid: true
            },
            Adresse: {
                title: "Adresse",
                type: "AddressInput",
                value: {"line1": "", "line2": "", "city": "", "PC": "", "country": ""},
                fullWidth: false,
                placeholder: "Adresse",
                isValid: true
            },
            PhoneNumber: {
                title: "Numéro de téléphone",
                type: "PhoneInput",
                value: "",
                fullWidth: true,
                placeholder: "0",
                isValid: true
            },
            Type: {
                title: "Type de restaurant",
                type: "SelectInput",
                value: [],
                options: [],
                fullWidth: false,
                multi: false,
                placeholder: ""
            }
        }
    }

    var getListOfTypes = async () => {

        var response = await api('post', {
            query: `query RestaurantTypes {
                restaurantTypes {
                  label
                  description
                  id : _id
                }
              }`
        }, '', 'Liste des types bien récupérée !', false);

        if(response) {

            var listOfTypes = [];
            response.data.restaurantTypes.map(type => {
                listOfTypes.push({"label": type.label, id: type.id});
            });

            generateModal = {
                title: "Créer un restaurant",
                elements: {
                    UploadFile: {
                        title: 'File Upload',
                        type: 'UploadFile',
                        fullWidth: false,
                        value: ''
                    },
                    Image: {
                        title: 'Image',
                        src: "https://institutcoop.hec.ca/es/wp-content/uploads/sites/3/2020/02/Deafult-Profile-Pitcher.png",
                        type: "Image",
                        fullWidth: false
                    },
                    Name: {
                        title: "Nom du restaurant",
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
                    Mail: {
                        title: "Mail",
                        type: "MailInput",
                        value: "",
                        fullWidth: false,
                        placeholder: "Mail",
                        isValid: true
                    },
                    Adresse: {
                        title: "Adresse",
                        type: "AddressInput",
                        value: {"line1": "", "line2": "", "city": "", "PC": "", "country": ""},
                        fullWidth: true,
                        placeholder: "Adresse",
                        isValid: true
                    },
                    PhoneNumber: {
                        title: "Numéro de téléphone",
                        type: "PhoneInput",
                        value: "",
                        fullWidth: true,
                        placeholder: "0",
                        isValid: true
                    },
                    Type: {
                        title: "Type de restaurant",
                        type: "SelectInput",
                        value: [],
                        options: listOfTypes,
                        fullWidth: false,
                        multi: false,
                        placeholder: ""
                    }
                }
            }
            setDataForms(generateModal);
            setGetTypes(false);
        }
    }

    var handleCreate = async (menuForms) => {

        var responseAddress = await api('post', {
            query: `mutation AddressCreateOne($record: CreateOneAddressInput!) {
                addressCreateOne(record: $record) {
                    record {
                        line1
                        line2
                        city
                        PC
                        country
                        _id
                    }
                }
            }`,
            variables: `{
                "record": {
                    "line1": "${menuForms.elements.Adresse.value.line1}",
                    "line2": "${menuForms.elements.Adresse.value.line2}",
                    "city": "${menuForms.elements.Adresse.value.city}",
                    "PC": "${menuForms.elements.Adresse.value.PC}",
                    "country": "${menuForms.elements.Adresse.value.country}"
                }
            }`
        }, '', 'L\'adresse a bien été créé !', true);

        var response = await api('post', {
            query: `mutation RestaurantCreateOne($record: CreateOneRestaurantInput!) {
                restaurantCreateOne(record: $record) {
                  record {
                    name
                    description
                    picture
                    ownerId
                    phoneNumber
                    mail
                    createdAt
                    _id
                  }
                }
              }`,
            variables: `{
                "record": {
                    "name": "${menuForms.elements.Name.value}",
                    "description": "${menuForms.elements.Description.value}",
                    "type": "${menuForms.elements.Type.value.map(type => { return type.id ;})}",
                    "mail": "${menuForms.elements.Mail.value}",
                    "phoneNumber": "${menuForms.elements.PhoneNumber.value}",
                    "ownerId": "${localStorage.getItem('UserID')}",
                    "picture": "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
                    "address": "${responseAddress.data.addressCreateOne.record._id}",
                    "products": [],
                    "menus": [],
                    "categories": []
                }
            }`
        }, '', 'Le restaurant a bien été créé !', true);
        localStorage.setItem("restaurantID", response.data.restaurantCreateOne.record._id);
        localStorage.setItem('ownRestaurant', true);
        history.push('/restaurant/orders');
        history.go(0);
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
            buttonlabel: "Créer le restaurant",
            type: 'primaire',
            function: handleCreate
        }
    ]

    React.useEffect(async () => {
        await getListOfTypes();
    }, [getTypes]);

    var [dataForms, setDataForms] = React.useState(generateModal);
    var [buttons, setButtons] = React.useState(buttonsModel);

    return (
        <IonPage className="overflow-y-auto mb-5">
            <AutoForms dataForms={dataForms} setDataForms={setDataForms} buttons={buttons}></AutoForms>
        </IonPage>
    );
};

export default CreateRestaurant;
