import { IonPage } from "@ionic/react";
import axios from "axios";
import * as React from 'react';
import AutoForms from "../../ui/AutoForms";
import { useHistory  } from "react-router-dom";
import api from "../../api";

var generateModal = {
    title: "Modifier son compte",
    elements: {
        UploadFile: {
            title: 'File Upload',
            type: 'UploadFile',
            fullWidth: false,
            value: ''
        },
        Image: {
            title: 'Avatar',
            src: "https://institutcoop.hec.ca/es/wp-content/uploads/sites/3/2020/02/Deafult-Profile-Pitcher.png",
            type: "Image",
            fullWidth: false
        },
        Firstname: {
            title: "Prénom",
            type: "Input",
            value: '',
            fullWidth: false,
            placeholder: "Prénom"
        },
        Lastname: {
            title: "Nom",
            type: "Input",
            value: '',
            fullWidth: false,
            placeholder: "Nom"
        },
        Mail: {
            title: "Mail",
            type: "Input",
            value: '',
            fullWidth: true,
            placeholder: "Mail"
        },
        Password: {
            title: "Mot de passe",
            type: "PasswordInput",
            value: '',
            fullWidth: true,
            placeholder: "Mot de passe"
        },
        PhoneNumber: {
            title: "Numéro de téléphone",
            type: "PhoneInput",
            flag: {label: 'France', id: 'FR', dialCode: '+33'},
            fullWidth: false,
            value: ''
        }
    }
};
const Modify = (props) => {
    if(props.location.state) {
        var id = props.location.state.userID ? props.location.state.userID : 2;
    } else if (localStorage.getItem('modifyUserID')) {
        var id = localStorage.getItem('modifyUserID') ? localStorage.getItem('modifyUserID') : 2;
    }
    else {
        var id =  2;
    }
    var [updateId, setUpdateid] = React.useState(null); 
    var [user, setUser] = React.useState({
        ID: '',
        Firstname: '',
        Lastname: '',
        Password: '',
        Mail: '',
        PhoneNumber: '',
        Avatar: ''
    });
    var getUser = async (id) => {
        await axios({
            url: `http://${process.env.NEXT_PUBLIC_MDW_HOST}:${process.env.NEXT_PUBLIC_MDW_PORT}/graphql`,
            method: 'post',
            data: {
                query: `query($id: String)  {
                    userById(ID: $id) {
                      Firstname
                      ID
                      Lastname
                      Password
                      Mail
                      PhoneNumber
                      Avatar
                    }
                  }`,
                variables: `{
                    "id": "${id}"
                }`
            }
          }).then(response => {
            setUser(response.data.data.userById);
            if(user) {
                generateModal = {
                    title: "Modifier son compte",
                    elements: {
                        UploadFile: {
                            title: 'File Upload',
                            type: 'UploadFile',
                            fullWidth: false,
                            value: ''
                        },
                        Image: {
                            title: 'Avatar',
                            src: "https://institutcoop.hec.ca/es/wp-content/uploads/sites/3/2020/02/Deafult-Profile-Pitcher.png",
                            type: "Image",
                            fullWidth: false
                        },
                        Firstname: {
                            title: "Prénom",
                            type: "Input",
                            value: user.Firstname,
                            fullWidth: false,
                            placeholder: "Prénom"
                        },
                        Lastname: {
                            title: "Nom",
                            type: "Input",
                            value: user.Lastname,
                            fullWidth: false,
                            placeholder: "Nom"
                        },
                        Mail: {
                            title: "Mail",
                            type: "Input",
                            value: user.Mail,
                            fullWidth: true,
                            placeholder: "Mail"
                        },
                        Password: {
                            title: "Mot de passe",
                            type: "PasswordInput",
                            value: user.Password,
                            fullWidth: true,
                            placeholder: "Mot de passe"
                        },
                        PhoneNumber: {
                            title: "Numéro de téléphone",
                            type: "PhoneInput",
                            flag: {label: 'France', id: 'FR', dialCode: '+33'},
                            fullWidth: false,
                            value: user.PhoneNumber
                        }
                    }
                };
            }
            setDataForms(generateModal);
            setUpdateid(id);
          })
    };

    var [dataForms, setDataForms] = React.useState(generateModal);
    React.useEffect(async () => {
        if(updateId !== id) {
            //On recherche les informatiosn de l'utilisateur
            await getUser(id);
        }
    }, [user]);

    var history = useHistory();
    var handleModify = async (modifyForms) => {
        var response = await api('post', {
            query: `mutation Mutation($id: String, $record: UserCreateInput) {
                userUpdateById(ID: $id, record: $record) {
                    record {
                    ID
                    }
                }
            }`,
            variables: `{
                "id": "${id}",
                "record": {
                    "Firstname": "${modifyForms.elements.Firstname.value}",
                    "Lastname": "${modifyForms.elements.Lastname.value}",
                    "Password": "${modifyForms.elements.Password.value}",
                    "Mail": "${modifyForms.elements.Mail.value}",
                    "PhoneNumber": "${modifyForms.elements.PhoneNumber.value}",
                    "Avatar": null
                }
              }`
        }, '', 'Le compte utilisateur a bien été modifié !', true);
        history.goBack();
    }
    var cancelButton = () => {
        history.goBack();
    }
    
    var buttonsModel = [
        {
            buttonlabel: "Annuler",
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
