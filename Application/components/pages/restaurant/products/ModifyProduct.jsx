import { IonPage } from "@ionic/react";
import axios from "axios";
import * as React from 'react';
import AutoForms from "../../../ui/AutoForms";
import { useHistory  } from "react-router-dom";
import api from "../../../api";

var generateModal = {
    title: "Modifier le produit",
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
        },
        Available: {
            title: "Disponibilité du produit",
            type: "SelectInput",
            value: [{"label": "Disponible", "id": "2"}],
            option: [{"label": "Indisponible", "id": "1"}, {"label": "Disponible", "id": "2"}],
            fullWidth: false,
            multi: false,
            placeholder: ""
        }
    }
}
const Modify = (props) => {
    if(props.location.state) {
        var id = props.location.state.productID ? props.location.state.productID : "62b1ccb74b500fbdb6202ede";
    }
    else if (localStorage.getItem('modifyProductID')) {
        var id = localStorage.getItem('modifyProductID') ? localStorage.getItem('modifyProductID') : null;
    }  
    else {
        var id =  "62b1ccb74b500fbdb6202ede";
    }
    var [updateId, setUpdateid] = React.useState(null); 
    var [product, setProduct] = React.useState({
        _id: '',
        name: '',
        description: '',
        price: '',
        allergenicIngredients: '',
        available: false,
        image: ''
    });
    var getProduct = async (id) => {
        await axios({
            url: process.env.NEXT_PUBLIC_MDW_URL,
            method: 'post',
            data: {
                query: `query Query($id: MongoID!) {
                    productById(_id: $id) {
                      name
                      description
                      price
                      picture
                      allergenicIngredients
                      available
                    }
                  }`,
                variables: `{
                    "id": "${id}"
                }`
            }
          }).then(response => {
            setProduct(response.data.data.productById);
            generateModal = {
                title: "Modifier le produit",
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
                        title: "Nom du produit",
                        type: "Input",
                        value: product.name,
                        fullWidth: false,
                        placeholder: "Nom",
                        isValid: true
                    },
                    Description: {
                        title: "Description",
                        type: "Input",
                        value: product.description,
                        fullWidth: false,
                        placeholder: "Description",
                        isValid: true
                    },
                    Price: {
                        title: "Prix",
                        type: "Input",
                        value: product.price,
                        fullWidth: false,
                        placeholder: "0",
                        isValid: true
                    },
                    AllergenicIngredients: {
                        title: "Ingrédients allergènes",
                        type: "Input",
                        value: product.allergenicIngredients,
                        fullWidth: false,
                        placeholder: "Ingrédients allergènes",
                        isValid: true
                    },
                    Available: {
                        title: "Disponibilité du produit",
                        type: "SelectInput",
                        value: [{"label": product.available ? "Disponible" : "Indisponible", id: product.available ? 2 : 1}],
                        options: [{"label": "Indisponible", id: "1"}, {"label": "Disponible", id: "2"}],
                        fullWidth: false,
                        multi: false,
                        placeholder: ""
                    }
                }
            }
            setDataForms(generateModal);
            setUpdateid(id);
          })
    };

    var [dataForms, setDataForms] = React.useState(generateModal);
    React.useEffect(async () => {
        if(updateId !== id) {
            //On recherche les informatiosn de l'utilisateur
            await getProduct(id);
        }
    }, [product]);

    var history = useHistory();
    var handleModify = async (modifyForms) => {
        var response = await api('post', {
            query: `mutation ProductUpdateById($id: MongoID!, $record: UpdateByIdProductInput!) {
                productUpdateById(_id: $id, record: $record) {
                  record {
                    name
                    description
                    price
                    picture
                    allergenicIngredients
                    available
                  }
                }
              }`,
            variables: `{
                "id": "${id}",
                "record": {
                    "name": "${modifyForms.elements.Name.value}",
                    "description": "${modifyForms.elements.Description.value}",
                    "price": ${modifyForms.elements.Price.value},
                    "allergenicIngredients": "${modifyForms.elements.AllergenicIngredients.value}",
                    "available": ${modifyForms.elements.Available.value[0].label === "Disponible" ? true : false},
                    "picture": "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                }
              }`
        }, '', 'Le produit a bien été modifié !', true);
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
        <IonPage className="top-14 mb-20 overflow-y-auto mb-5 bg-white">
            <AutoForms dataForms={dataForms} setDataForms={setDataForms} buttons={buttons}></AutoForms>
        </IonPage>
    );
};

export default Modify;
