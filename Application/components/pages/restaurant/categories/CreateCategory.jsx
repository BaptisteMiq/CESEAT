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


const CreateCategory = (props) => {
    let history = useHistory();
    var [products, setProducts] = React.useState([]);
    var [getProducts, setGetProducts] = React.useState(true);
    var [menus, setMenus] = React.useState([]);
    var generateModal = {
        title: "Créer une catégorie",
        elements: {
            Name: {
                title: "Nom de la catégorie",
                type: "Input",
                value: "",
                fullWidth: false,
                placeholder: "Nom",
                isValid: true
            },
            Menus: {
                title: "Sélectionner des menus à ajouter dans la catégorie",
                type: "SelectInput",
                value: [],
                options: [],
                fullWidth: false,
                multi: true,
                placeholder: ""
            },
            Products: {
                title: "Sélectionner des produits à ajouter dans la catégorie",
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
            query: `query Products {
                myRestaurant {
                  products {
                    _id
                    name
                    description
                    price
                    picture
                    allergenicIngredients
                    available
                    createdAt
                  }
                  menus {
                    name
                    description
                    price
                    picture
                    createdAt
                    available
                    products {
                      _id
                      name
                    }
                    _id
                  }
                }
              }`
        }, '', 'Liste des articles bien récupérée !', false);
        if(response) {

            var listOfProducts = [];
            var listOfMenus = [];
            response.data.myRestaurant.products.map(product => {
                listOfProducts.push({"label": product.name, id: product._id});
            });

            response.data.myRestaurant.menus.map(menu => {
                listOfMenus.push({"label": menu.name, id: menu._id});
            });

            generateModal = {
                title: "Créer une catégorie",
                elements: {
                    Name: {
                        title: "Nom de la catégorie",
                        type: "Input",
                        value: "",
                        fullWidth: false,
                        placeholder: "Nom",
                        isValid: true
                    },
                    Menus: {
                        title: "Sélectionner des menus à ajouter dans la catégorie",
                        type: "SelectInput",
                        value: [],
                        options: listOfMenus,
                        fullWidth: false,
                        multi: true,
                        placeholder: ""
                    },
                    Products: {
                        title: "Sélectionner des produits à ajouter dans la catégorie",
                        type: "SelectInput",
                        value: [],
                        options: listOfProducts,
                        fullWidth: false,
                        multi: true,
                        placeholder: ""
                    }
                }
            }
            setDataForms(generateModal);
            setProducts(listOfProducts);
            setMenus(listOfMenus);
            setGetProducts(false);
        }
    }

    var handleCreate = async (menuForms) => {
        var listProductId = [];
        var listMenuId = [];
        menuForms.elements.Products.value.map(product => {
            listProductId.push(product.id);
        });

        menuForms.elements.Menus.value.map(menu => {
            listMenuId.push(menu.id);
        });

        var response = await api('post', {
            query: `mutation AddCategoryToMyRestaurant($record: CreateOneCategoryInput!) {
                addCategoryToMyRestaurant(record: $record) {
                  recordId
                }
              }`,
            variables: `{
                "record": {
                    "name": "${menuForms.elements.Name.value}",
                    "menus": [${menuForms.elements.Menus.value.map(menu => { return '"'+ menu.id +'"';})}],
                    "products": [${menuForms.elements.Products.value.map(product => { return '"'+ product.id +'"';})}]
                }
            }`
        }, '', 'La catégorie a bien été créé !', true);
        history.push('/restaurant/category');
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
            buttonlabel: "Créer la catégorie",
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
        <IonPage className="top-14 overflow-y-auto mb-5">
            <AutoForms dataForms={dataForms} setDataForms={setDataForms} buttons={buttons}></AutoForms>
        </IonPage>
    );
};

export default CreateCategory;
