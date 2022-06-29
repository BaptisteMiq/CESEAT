import { IonPage } from "@ionic/react";
import axios from "axios";
import * as React from 'react';
import AutoForms from "../../ui/AutoForms";
import { useHistory  } from "react-router-dom";
import api from "../../api";

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

const Modify = (props) => {
    if(props.location.state) {
        var id = props.location.state.addressID ? props.location.state.addressID : "62b2df59595ed321ce940fe5";
    } 
    else if (localStorage.getItem('modifyAddressID')) {
        var id = localStorage.getItem('modifyAddressID') ? localStorage.getItem('modifyAddressID') : 2;
    }
    else {
        var id =  "62b2df59595ed321ce940fe5";
    }
    var [updateId, setUpdateid] = React.useState(null); 
    var [address, setAddress] = React.useState({
        _id: '',
        line1: '',
        line2: '',
        city: '',
        PC: '',
        country: ''
    });
    var getAddress = async (id) => {
        await axios({
            url: `http://${process.env.NEXT_PUBLIC_MDW_HOST}:${process.env.NEXT_PUBLIC_MDW_PORT}/graphql`,
            method: 'post',
            data: {
                query: `query AddressById($id: MongoID!) {
                    addressById(_id: $id) {
                      line1
                      line2
                      city
                      PC
                      country
                      _id
                    }
                  }`,
                variables: `{
                    "id": "${id}"
                }`
            }
          }).then(response => {
            setAddress(response.data.data.addressById);
            generateModal = {
                title: "Ajouter une adresse",
                elements: {
                    Line1: {
                        title: "Adresse",
                        type: "Input",
                        value: address.line1,
                        fullWidth: true,
                        placeholder: "Adresse",
                        isValid: true
                    },
                    Line2: {
                        title: "Complément d'adresse",
                        type: "Input",
                        value: address.line2,
                        fullWidth: true,
                        placeholder: "Complément d'adresse",
                        isValid: true
                    },
                    City: {
                        title: "Ville",
                        type: "Input",
                        value: address.city,
                        fullWidth: false,
                        placeholder: "Ville",
                        isValid: true
                    },
                    PC: {
                        title: "Code Postal",
                        type: "Input",
                        value: address.PC,
                        fullWidth: false,
                        placeholder: "Code Postal",
                        isValid: true
                    },
                    Country: {
                        title: "Pays",
                        type: "Input",
                        value: address.country,
                        fullWidth: false,
                        placeholder: "Pays",
                        isValid: true
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
            await getAddress(id);
        }
    }, [address]);

    var history = useHistory();
    var handleModify = async (modifyForms) => {
        var response = await api('post', {
            query: `mutation AddressUpdateById($record: UpdateByIdAddressInput!, $id: MongoID!) {
                addressUpdateById(record: $record, _id: $id) {
                  recordId
                }
              }`,
            variables: `{
                "id": "${id}",
                "record": {
                    "line1": "${modifyForms.elements.Line1.value}",
                    "line2": "${modifyForms.elements.Line2.value}",
                    "city": "${modifyForms.elements.City.value}",
                    "PC": "${modifyForms.elements.PC.value}",
                    "country": "${modifyForms.elements.Country.value}"
                }
              }`
        }, '', 'L\'adresse a bien été modifiée !', true);
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
        <IonPage className="overflow-y-auto mb-5 bg-white">
            <AutoForms dataForms={dataForms} setDataForms={setDataForms} buttons={buttons}></AutoForms>
        </IonPage>
    );
};

export default Modify;
