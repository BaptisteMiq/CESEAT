import { IonPage } from "@ionic/react";
import axios from "axios";
import * as React from 'react';
import AutoForms from "../../../ui/AutoForms";
import { useHistory  } from "react-router-dom";
import api from "../../../api";

// title = Permet d'afficher le nom de l'input
// type = Permet de choisir letype d'input : ['UploadFile','Input','PasswordInput','PhoneInput']
// fullWidth: Permet de chosir si l'input doit être en full largeur ou non [true, false]
// placeholder = Permet d'afficher le texte à saisir
// Flag array avec un label, id du pays et le dialcode


const CreateMenu = (props) => {
    let history = useHistory();
    var [products, setProducts] = React.useState([]);
    var [getProducts, setGetProducts] = React.useState(true);
    var generateModal = {
        title: "Créer un menu",
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
                title: "Nom du menu",
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
            Available: {
                title: "Disponibilité du menu",
                type: "SelectInput",
                value: [{"label": "Disponible" , id: 2 }],
                options: [{"label": "Indisponible", id: "1"}, {"label": "Disponible", id: "2"}],
                fullWidth: false,
                multi: false,
                placeholder: ""
            },
            Products: {
                title: "Sélectionner des produits à ajouter dans le menu",
                type: "SelectInput",
                value: [],
                options: [],
                fullWidth: false,
                multi: true,
                placeholder: ""
            }
        }
    }
    var getListOfProducts = async () => {

        var response = await api('post', {
            query: `query Menus {
                myRestaurant {
                  products {
                    _id
                    name
                  }
                }
              }`
        }, '', 'Liste des produits bien récupérée !', false);
        if(response) {

            var listOfproducts = [];
            response.data.myRestaurant.products.map(product => {
                listOfproducts.push({"label": product.name, id: product._id});
            });

            generateModal = {
                title: "Créer un menu",
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
                        title: "Nom du menu",
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
                    Available: {
                        title: "Disponibilité du menu",
                        type: "SelectInput",
                        value: [{"label": "Disponible" , id: 2 }],
                        options: [{"label": "Indisponible", id: "1"}, {"label": "Disponible", id: "2"}],
                        fullWidth: false,
                        multi: false,
                        placeholder: ""
                    },
                    Products: {
                        title: "Sélectionner des produits à ajouter dans le menu",
                        type: "SelectInput",
                        value: [],
                        options: listOfproducts,
                        fullWidth: false,
                        multi: true,
                        placeholder: ""
                    }
                }
            }
            setDataForms(generateModal);
            setProducts(listOfproducts);
            setGetProducts(false);
        }
    }

    var handleCreate = async (menuForms) => {
        var listProductId = [];
        menuForms.elements.Products.value.map(product => {
            listProductId.push(product.id);
        });

        var response = await api('post', {
            query: `mutation Mutation($record: CreateOneMenuInput!) {
                addMenuToMyRestaurant(record: $record) {
                  record {
                    _id
                  }
                }
              }`,
            variables: `{
                "record": {
                    "name": "${menuForms.elements.Name.value}",
                    "description": "${menuForms.elements.Description.value}",
                    "price": ${menuForms.elements.Price.value},
                    "picture": "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
                    "available": ${menuForms.elements.Available.value[0].label === "Disponible" ? true : false},
                    "products": [${menuForms.elements.Products.value.map(product => { return '"'+ product.id +'"';})}]
                }
            }`
        }, '', 'Le menu a bien été créé !', true);
        history.push('/restaurant/menu');
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
            buttonlabel: "Créer le menu",
            type: 'primaire',
            function: handleCreate
        }
    ]

    React.useEffect(async () => {
        await getListOfProducts();
    }, [getProducts]);

    var [dataForms, setDataForms] = React.useState(generateModal);
    var [buttons, setButtons] = React.useState(buttonsModel);

    return (
        <IonPage className="top-14 mb-20 overflow-y-auto mb-5">
            <AutoForms dataForms={dataForms} setDataForms={setDataForms} buttons={buttons}></AutoForms>
        </IonPage>
    );
};

export default CreateMenu;
