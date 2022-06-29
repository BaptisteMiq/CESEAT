import { IonPage } from "@ionic/react";
import axios from "axios";
import * as React from 'react';
import AutoForms from "../../../ui/AutoForms";
import { useHistory  } from "react-router-dom";
import api from "../../../api";

var generateModal = {
    title: "Modifier une catégorie",
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
const ModifyCategory = (props) => {
    if(props.location.state) {
        var id = props.location.state.categoryID ? props.location.state.categoryID : null;
    } else if (localStorage.getItem('modifyCategoryID')) {
        var id = localStorage.getItem('modifyCategoryID') ? localStorage.getItem('modifyCategoryID') : null;
    } 
    else {
        var id =  null;
    }
    var [updateId, setUpdateid] = React.useState(null); 
    var [category, setCategory] = React.useState({
        _id: '',
        name: '',
        menus: [],
        products: []
    });
    var [getProducts, setGetProducts] = React.useState(true);

    var listOfproducts = [];
    var listOfMenus = [];
    var getListOfProducts = async () => {

        var response = await api('post', {
            query: `query MyRestaurant {
                myRestaurant {
                  _id
                  menus {
                    name
                    _id
                  }
                  products {
                    name
                    _id
                  }
                }
              }`
        }, '', 'Liste des articles bien récupérée !', false);

        if(response) {
            response.data.myRestaurant.products.map(product => {
                listOfproducts.push({"label": product.name, "id": product._id});
            });
            response.data.myRestaurant.menus.map(menu => {
                listOfMenus.push({"label": menu.name, "id": menu._id});
            });

            setGetProducts(false);
        }
    }

    var getCategory = async (id) => {
        await axios({
            url: 'http://localhost:4000/graphql',
            method: 'post',
            data: {
                query: `query MyRestaurant($id: MongoID!) {
                    categoryById(_id: $id) {
                      name
                      menus {
                        label: name
                        id: _id
                      }
                      products {
                        label: name
                        id: _id
                      }
                      _id
                    }
                  }`,
                variables: `{
                    "id": "${id}"
                }`
            }
          }).then(response => {
            setCategory(response.data.data.categoryById);
            if(category) {
                var generateModal = {
                    title: "Modifier une catégorie",
                    elements: {
                        Name: {
                            title: "Nom de la catégorie",
                            type: "Input",
                            value: category.name,
                            fullWidth: false,
                            placeholder: "Nom",
                            isValid: true
                        },
                        Menus: {
                            title: "Sélectionner des menus à ajouter dans la catégorie",
                            type: "SelectInput",
                            value: category.menus,
                            options: listOfMenus,
                            fullWidth: false,
                            multi: true,
                            placeholder: ""
                        },
                        Products: {
                            title: "Sélectionner des produits à ajouter dans la catégorie",
                            type: "SelectInput",
                            value: category.products,
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
            await getCategory(id);
        }
    }, [category, getProducts]);

    var history = useHistory();
    var handleModify = async (menuForms) => {
        var response = await api('post', {
            query: `mutation CategoryUpdateById($id: MongoID!, $record: UpdateByIdCategoryInput!) {
                categoryUpdateById(_id: $id, record: $record) {
                  recordId
                }
              }`,
            variables: `{
                "id": "${id}",
                "record": {
                    "name": "${menuForms.elements.Name.value}",
                    "menus": [${menuForms.elements.Menus.value.map(menu => { return '"'+ menu.id +'"';})}],
                    "products": [${menuForms.elements.Products.value.map(product => { return '"'+ product.id +'"';})}]
                }
              }`
        }, '', 'La catégorie a bien été modifié !', true);
        history.push('/restaurant/category');
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
        <IonPage className="overflow-y-auto mb-5 bg-white">
            <AutoForms dataForms={dataForms} setDataForms={setDataForms} buttons={buttons}></AutoForms>
        </IonPage>
    );
};

export default ModifyCategory;
