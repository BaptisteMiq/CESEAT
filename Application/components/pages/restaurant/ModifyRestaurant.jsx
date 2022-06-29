import { IonPage } from "@ionic/react";
import axios from "axios";
import * as React from 'react';
import AutoForms from "../../ui/AutoForms";
import { useHistory  } from "react-router-dom";
import api from "../../api";

var generateModal = {
    title: "Modifier un restaurant",
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

const ModifyRestaurant = (props) => {
    if(props.location.state) {
        var id = props.location.state.restaurantID ? props.location.state.restaurantID : null;
    } else if (localStorage.getItem('restaurantID')) {
        var id = localStorage.getItem('restaurantID') ? localStorage.getItem('restaurantID') : null;
    } 
    else {
        var id =  null;
    }
    var [updateId, setUpdateid] = React.useState(null); 
    var [restaurant, setRestaurant] = React.useState({
        _id: '',
        name: '',
        description: '',
        mail: '',
        address: {},
        phoneNumber: '',
        type: []
    });
    var [getType, setGetType] = React.useState(true);

    var listOfTypes = [];
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
            listOfTypes = [];
            response.data.restaurantTypes.map(type => {
                listOfTypes.push({"label": type.label, 'id': type.id});
            });
            setGetType(false);
        }
    }

    var getRestaurant = async (id) => {
        var response = await api('post', {
            query: `query MyRestaurant {
                myRestaurant {
                  name
                  description
                  picture
                  phoneNumber
                  mail
                  type {
                    label
                    id: _id
                  }
                  address {
                    line1
                    line2
                    city
                    PC
                    country
                    userId
                    _id
                  }
                  _id
                }
              }`
        }, '', 'Restaurant bien récupéré !', false);
        if(response) {
            setRestaurant(response.data.myRestaurant);
            if(restaurant) {
                var generateModal = {
                    title: "Modifier un restaurant",
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
                            value: restaurant.name,
                            fullWidth: false,
                            placeholder: "Nom",
                            isValid: true
                        },
                        Description: {
                            title: "Description",
                            type: "Input",
                            value: restaurant.description,
                            fullWidth: false,
                            placeholder: "Description",
                            isValid: true
                        },
                        Mail: {
                            title: "Mail",
                            type: "MailInput",
                            value: restaurant.mail,
                            fullWidth: false,
                            placeholder: "Mail",
                            isValid: true
                        },
                        Adresse: {
                            title: "Adresse",
                            type: "AddressInput",
                            value: restaurant.address,
                            fullWidth: true,
                            placeholder: "Adresse",
                            isValid: true
                        },
                        PhoneNumber: {
                            title: "Numéro de téléphone",
                            type: "PhoneInput",
                            value: restaurant.phoneNumber,
                            fullWidth: true,
                            placeholder: "0",
                            isValid: true
                        },
                        Type: {
                            title: "Type de restaurant",
                            type: "SelectInput",
                            value: [restaurant.type],
                            options: listOfTypes,
                            fullWidth: false,
                            multi: false,
                            placeholder: ""
                        }
                    }
                }
            }
            setDataForms(generateModal);
            if(id) {
                setUpdateid(id);
            }
        }
    };

    var [dataForms, setDataForms] = React.useState(generateModal);
    React.useEffect(async () => {
        await getListOfTypes();
        if(updateId !== id) {
            //On recherche les informatiosn de l'utilisateur
            await getRestaurant(id);
        }
    }, [restaurant, getType]);

    var history = useHistory();
    var handleModify = async (menuForms) => {
        var responseAddress = await api('post', {
            query: `mutation AddressUpdateById($id: MongoID!, $record: UpdateByIdAddressInput!) {
                addressUpdateById(_id: $id, record: $record) {
                  recordId
                }
              }`,
            variables: `{
                "id": "${menuForms.elements.Adresse.value._id}",
                "record": {
                    "line1": "${menuForms.elements.Adresse.value.line1}",
                    "line2": "${menuForms.elements.Adresse.value.line2}",
                    "city": "${menuForms.elements.Adresse.value.city}",
                    "PC": "${menuForms.elements.Adresse.value.PC}",
                    "country": "${menuForms.elements.Adresse.value.country}"
                }
            }`
        }, '', 'L\'adresse a bien été modifié !', false);

        var response = await api('post', {
            query: `mutation RestaurantUpdateById($id: MongoID!, $record: UpdateByIdRestaurantInput!) {
                restaurantUpdateById(_id: $id, record: $record) {
                  recordId
                }
              }`,
            variables: `{
                "id": "${id}",
                "record": {
                    "name": "${menuForms.elements.Name.value}",
                    "description": "${menuForms.elements.Description.value}",
                    "picture": "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
                    "phoneNumber": "${menuForms.elements.PhoneNumber.value}",
                    "mail": "${menuForms.elements.Mail.value}",
                    "type": "${menuForms.elements.Type.value[0].id}",
                    "address": "${menuForms.elements.Adresse.value._id}"
                }
              }`
        }, '', 'Le restaurant a bien été modifié !', true);
        history.push('/restaurant/orders');
    }
    var cancelButton = () => {
        history.goBack();
    }
    
    var buttonsModel = [
        {
            buttonlabel: "Retour",
            type: 'secondary',
            function: cancelButton
        },
        {
            buttonlabel: "Modifier",
            type: 'primaire',
            function: handleModify
        }
    ]

    var [buttons, setButtons] = React.useState(buttonsModel);

    return (
        <IonPage className="top-14 overflow-y-auto mb-5 bg-white">
            <AutoForms dataForms={dataForms} setDataForms={setDataForms} buttons={buttons}></AutoForms>
        </IonPage>
    );
};

export default ModifyRestaurant;
