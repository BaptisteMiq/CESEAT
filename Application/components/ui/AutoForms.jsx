import { IonPage } from "@ionic/react";
import { Button, KIND } from "baseui/button";
import { Card, StyledAction, StyledBody } from "baseui/card";
import { FileUploader } from "baseui/file-uploader";
import { Input } from 'baseui/input';
import { PhoneInput, StyledFlag } from "baseui/phone-input";
import {
    HeadingSmall,
    HeadingXSmall
} from 'baseui/typography';
import Image from 'next/image';
import * as React from 'react';

function CustomFlag(props) {
    const {children, ...rest} = props;
    return <StyledFlag iso={props.$iso} {...rest} />;
}

// title = Permet d'afficher le nom de l'input
// type = Permet de choisir letype d'input : ['UploadFile','Input','PasswordInput','PhoneInput']
// fullWidth: Permet de chosir si l'input doit être en full largeur ou non [true, false]
// placeholder = Permet d'afficher le texte à saisir
var generateModal = {
    title: "S'inscrire",
    elements: [
        {
            title: 'File Upload',
            type: 'UploadFile',
            fullWidth: true,
            value: ''
        },
        {
            title: "Nom",
            type: "Input",
            value: "Joe",
            fullWidth: false,
            placeholder: "Nom"
        },
        {
            title: "Prénom",
            type: "Input",
            value: "Tintin",
            fullWidth: false,
            placeholder: "Prénom"
        },
        {
            title: "Mail",
            type: "Input",
            value: "joe.tintin@gmail.com",
            fullWidth: false,
            placeholder: "mail"
        },
        {
            title: "Mot de passe",
            type: "PasswordInput",
            value: "MonSuperMDP",
            fullWidth: false,
            placeholder: "Mot de passe"
        },
        {
            title: "Numéro de téléphone",
            type: "PhoneInput",
            fullWidth: false,
            value: ""
        }
    ],
    buttons: [
        {
            buttonlabel: "Annuler",
            type: 'primaire'
        },
        
        {
            buttonlabel: "S'inscrire",
            type: 'primaire'
        },
        {
            buttonlabel: "Se connecter",
            type: 'secondaire'
        }
    ]
}

const AutoForms = (props) => {
    var generateBody = (key, element) => {
        switch (element.type) {
            case 'Input':
                return (
                    <Input
                        value={props.dataForms.elements[key].value}
                        onChange={e => props.setDataForms({
                            ...props.dataForms, elements: {
                                ...props.dataForms.elements,
                                [key]: {
                                    ...props.dataForms.elements[key],
                                    value: e.target.value
                                        }
                            }
                        })}
                        placeholder={element.placeholder}
                        clearOnEscape
                    />
                );
            case 'PasswordInput':
                return (
                    <Input
                        value={props.dataForms.elements[key].value}
                        type="password"
                        onChange={e => props.setDataForms({
                            ...props.dataForms, elements: {
                                ...props.dataForms.elements,
                                [key]: {
                                    ...props.dataForms.elements[key],
                                    value: e.target.value
                                    }
                            }
                        })}
                        placeholder={element.placeholder}
                        clearOnEscape
                    />
                );
            case 'PhoneInput':
                return (
                    <PhoneInput
                        text={props.dataForms.elements[key].value}
                        country={props.dataForms.elements[key].flag}
                        onTextChange={(event) => props.setDataForms({
                            ...props.dataForms, elements: {
                                ...props.dataForms.elements,
                                [key]: {
                                    ...props.dataForms.elements[key],
                                    value: event.currentTarget.value
                                        }
                            }
                        })}
                        onCountryChange={(event) => props.setDataForms({
                            ...props.dataForms, elements: {
                                ...props.dataForms.elements,
                                [key]: {
                                    ...props.dataForms.elements[key],
                                    flag: event.option
                                        }
                            }
                        })}
                        overrides={{
                            FlagContainer: {
                            component: CustomFlag,
                            },
                        }}
                    />
                );
            case 'UploadFile':
                return (
                    <div className="flex flex-row justify-center w-full">
                        <div className="m-4 w-1/2">
                            <FileUploader />
                        </div>
                    </div>
                );
            case 'Image':
                return (
                    <div className="flex flex-row justify-center" style={{width: '100%', height: '100%', minHeight: "200px", position: 'relative'}}>
                        <div className="m-2">
                            <Image objectFit="cover" src={props.dataForms.elements[key].src} alt="" layout="fill"/>
                        </div>
                    </div>
                );
        }
    }

    return (
        <IonPage className="overflow-y-auto mb-5">
            <Card
                overrides={{
                    Root: {
                    style: {
                        left: "50%",
                        maxWidth: "620px",
                        position: "absolute",
                        top: "20px",
                        transform: "translate(-50%, 0)",
                        width: "95vw"
                    }
                    }
                }}
            >
                <StyledBody className="flex flex-col">
                    <HeadingSmall className='font-bold ml-4'>{generateModal.title}</HeadingSmall>
                    <div className="flex flex-wrap">
                        {
                            Object.entries(props.dataForms.elements).map( ([key, element]) => (

                                <div className={element.fullWidth ? 'flex flex-auto flex-col m-3 w-full' : 'flex flex-auto flex-col m-3'} style={{minWidth: '240px'}}>
                                    <HeadingXSmall>{element.title}</HeadingXSmall>
                                    {  generateBody(key, element)  }
                                </div> 
                            ))
                        }
                    </div>
                </StyledBody>
                <StyledAction>
                    <div className="flex flex-row flex-auto justify-center">
                        {
                            props.buttons.map(button => (
                                <div className="m-3 w-full">
                                    <Button
                                        overrides={{
                                        BaseButton: {
                                            style: () => ({
                                                width: '100%'
                                            })
                                        }
                                        }}
                                        kind={button.type === 'primaire' ? KIND.primary : (button.type === 'secondaire' ? KIND.secondary : KIND.tertiary )}
                                        onClick={() => button.function(props.dataForms)}
                                    >
                                        {button.buttonlabel}
                                    </Button>
                                </div>
                            ))
                        }
                    </div>
                </StyledAction>
            </Card>
        </IonPage>
    );
};

export default AutoForms;
