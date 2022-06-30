import { IonPage } from "@ionic/react";
import axios from "axios";
import * as React from 'react';
import AutoForms from "../../../ui/AutoForms";
import { useHistory  } from "react-router-dom";
import api from "../../../api";
import { defaultImage } from "../../../ui/Images";

var generateModal = {
    title: "Modifier le menu",
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
            value: [{"label": "Disponible" , "id": 2 }],
            options: [{"label": "Indisponible", "id": "1"}, {"label": "Disponible", "id": "2"}],
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
        },
    }
}
const ModifyMenu = (props) => {
    if(props.location.state) {
        var id = props.location.state.menuID ? props.location.state.menuID : '1';
    } else if (localStorage.getItem('modifyMenuID')) {
        var id = localStorage.getItem('modifyMenuID') ? localStorage.getItem('modifyMenuID') : null;
    } 
    else {
        var id =  '1';
    }
    var [updateId, setUpdateid] = React.useState(null); 
    var [menu, setMenu] = React.useState({
        _id: '',
        name: '',
        description: '',
        price: '',
        products: [],
        available: false,
        image: ''
    });
    var [getProducts, setGetProducts] = React.useState(true);

    var listOfproducts = [];
    var getListOfProducts = async () => {

        var response = await api('post', {
            query: `query MyRestaurant {
                myRestaurant {
                  _id
                  products {
                    name
                    _id
                  }
                }
              }`
        }, '', 'Liste des produits bien récupérée !', false);
        if(response) {
            response.data.myRestaurant.products.map(product => {
                listOfproducts.push({"label": product.name, "id": product._id});
            });

            setGetProducts(false);
        }
    }

    var getMenu = async (id) => {
        await axios({
            url: 'http://localhost:4000/graphql',
            method: 'post',
            data: {
                query: `query MenuById($id: MongoID!) {
                    menuById(_id: $id) {
                      name
                      description
                      price
                      picture
                      available
                      _id
                      products {
                        label: name
                        id: _id
                      }
                    }
                  }`,
                variables: `{
                    "id": "${id}"
                }`
            }
          }).then(response => {
            setMenu(response.data.data.menuById);
            if(menu) {
                generateModal = {
                    title: "Modifier le menu",
                    elements: {
                        UploadFile: {
                            title: 'File Upload',
                            type: 'UploadFile',
                            fullWidth: false,
                            value: ''
                        },
                        Image: {
                            title: 'Image',
                            src: menu.picture ?? defaultImage,
                            type: "Image",
                            fullWidth: false
                        },
                        Name: {
                            title: "Nom du produit",
                            type: "Input",
                            value: menu.name,
                            fullWidth: false,
                            placeholder: "Nom",
                            isValid: true
                        },
                        Description: {
                            title: "Description",
                            type: "Input",
                            value: menu.description,
                            fullWidth: false,
                            placeholder: "Description",
                            isValid: true
                        },
                        Price: {
                            title: "Prix",
                            type: "Input",
                            value: menu.price,
                            fullWidth: false,
                            placeholder: "0",
                            isValid: true
                        },
                        Available: {
                            title: "Disponibilité du produit",
                            type: "SelectInput",
                            value: [{"label": menu.available ? "Disponible" : "Indisponible", "id" : menu.available ? 2 : 1}],
                            options: [{"label": "Indisponible", "id": "1"}, {"label": "Disponible", "id": "2"}],
                            fullWidth: false,
                            multi: false,
                            placeholder: ""
                        },
                        Products: {
                            title: "Sélectionner des produits à ajouter dans le menu",
                            type: "SelectInput",
                            value: menu.products,
                            options: listOfproducts,
                            fullWidth: false,
                            multi: true,
                            placeholder: ""
                        }

                    }
                }
            }
            setDataForms(generateModal);
            if(id) {
                setUpdateid(id);
            }
          })
    };

    var [dataForms, setDataForms] = React.useState(generateModal);
    React.useEffect(async () => {
        getListOfProducts();
        if(updateId !== id) {
            //On recherche les informatiosn de l'utilisateur
            await getMenu(id);
        }
    }, [menu, getProducts]);

    var history = useHistory();
    var handleModify = async (menuForms) => {
        var response = await api('post', {
            query: `mutation MenuUpdateById($id: MongoID!, $record: UpdateByIdMenuInput!) {
                menuUpdateById(_id: $id, record: $record) {
                  record {
                    name
                    description
                    price
                    picture
                    available
                    _id
                    products {
                        name
                        description
                        price
                        picture
                        allergenicIngredients
                        available
                        _id 
                    }
                  }
                }
              }`,
            variables: `{
                "id": "${id}",
                "record": {
                    "name": "${menuForms.elements.Name.value}",
                    "description": "${menuForms.elements.Description.value}",
                    "price": ${menuForms.elements.Price.value},
                    "picture": "${menuForms.elements.Image.src ?? defaultImage}",
                    "available": ${menuForms.elements.Available.value[0].label === "Disponible" ? true : false},
                    "products": [${menuForms.elements.Products.value.map(product => { return '"'+ product.id +'"';})}]
                }
              }`
        }, '', 'Le menu a bien été modifié !', true);
        history.goBack();
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

export default ModifyMenu;
