import { IonPage } from "@ionic/react";
import { Button, KIND } from "baseui/button";
import { Card, StyledAction, StyledBody } from "baseui/card";
import { FileUploader } from "baseui/file-uploader";
import { Input } from 'baseui/input';
import {validate as validateEmail} from 'email-validator';
import {FormControl} from 'baseui/form-control';
import { PhoneInput, StyledFlag } from "baseui/phone-input";
import CreateAddress from "../pages/address/CreateAddress";
import { KIND as ButtonKind } from "baseui/button";
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalButton,
    SIZE,
    ROLE
  } from "baseui/modal";
import { Select } from "baseui/select";
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

const AutoForms = (props) => {
    
    const [isOpen, setIsOpen] = React.useState(false);
    const [isUploading, setIsUploading] = React.useState(false);

    var checkMail = (key) => {
        return validateEmail(props.dataForms.elements[key].value);
    }

    var checkText = (key, value) => {
        return value.length >= 1;
    }

    var checkPassword = (key, value) => {
        return value.length >= 8;
    }

    var checkConfirm = (key, value) => {
        var data = props.dataForms.elements[key];
        if(data.confirm) {
            return (value === props.dataForms.elements[data.confirm].value ? true : false);
        }
    }

    const uploadFiles = async (key, files) => {
        setIsUploading(true);
        var formData = new FormData();
        formData.append('image', files[0]);
        const APIURL = `${process.env.NEXT_PUBLIC_CDN}/upload`;
        const response = await fetch(APIURL, {
            method: 'POST',
            body: formData
        }).catch(error => {
            console.log(error);
            throw error;
        });
        const data = await response.json();
        setIsUploading(false);
        if(data && data.success) {
            const path = data.path; // Do not set CDN URL here!!!
            props.setDataForms({
                ...props.dataForms, elements: {
                    ...props.dataForms.elements,
                    [key]: {
                        ...props.dataForms.elements[key],
                        value: path,
                            }
                }
            });

            props.setDataForms({
                ...props.dataForms, elements: {
                    ...props.dataForms.elements,
                    ["Image"]: {
                        ...props.dataForms.elements["Image"],
                        src: path,
                            }
                }
            });
        }
    }

    var generateBody = (key, element) => {
        switch (element.type) {
            case 'Input':
                return (
                    <FormControl
                        error={
                        !props.dataForms.elements[key].isValid
                            ? "La saisie n'est pas valide !"
                            : null
                    }
                    >
                        <Input
                            value={props.dataForms.elements[key].value}
                            onChange={e => props.setDataForms({
                                ...props.dataForms, elements: {
                                    ...props.dataForms.elements,
                                    [key]: {
                                        ...props.dataForms.elements[key],
                                        value: e.target.value,
                                        isValid: checkText(key, e.target.value)
                                            }
                                }
                            })}
                            placeholder={element.placeholder}
                            clearOnEscape
                        />
                    </FormControl>
                );
        case 'MailInput':
            return (
                <FormControl
                    error={
                    (props.dataForms.elements[key].confirm && !props.dataForms.elements[key].isConfirm)
                        ? 'Les emails ne correspondent pas !'
                        : (!props.dataForms.elements[key].isValid ? 'Ce n\'est pas un email valide !' : null)
                }
                >
                    <Input
                        value={props.dataForms.elements[key].value}
                        onChange={e => {props.setDataForms({
                            ...props.dataForms, elements: {
                                ...props.dataForms.elements,
                                [key]: {
                                    ...props.dataForms.elements[key],
                                    value: e.target.value,
                                    isValid: checkMail(key),
                                    isConfirm: checkConfirm(key, e.target.value)
                                }
                            }
                        })}}
                        placeholder={element.placeholder}
                        clearOnEscape
                        id="mail"
                    />
                </FormControl>
            );
        case 'AddressInput':
            return (
                <FormControl

                >
                    <div>
                    <Modal
                        onClose={() => setIsOpen(false)}
                        closeable
                        isOpen={isOpen}
                        animate
                        autoFocus
                        size={SIZE.default}
                        role={ROLE.dialog}
                        >
                        <ModalHeader>Modifier une adresse</ModalHeader>
                        <ModalBody>
                            <div className="flex flex-wrap">
                                <div className='flex flex-auto flex-col m-3' style={{minWidth: '240px'}}>
                                    <h1 className="font-bold">Adresse</h1>
                                    <Input
                                        value={props.dataForms.elements[key].value.line1}
                                        onChange={e => props.setDataForms({
                                            ...props.dataForms, elements: {
                                                ...props.dataForms.elements,
                                                [key]: {
                                                    ...props.dataForms.elements[key],
                                                    value: {
                                                        ...props.dataForms.elements[key].value,
                                                        line1: e.target.value
                                                    }
                                                    }
                                            }
                                        })}
                                        placeholder='Adresse'
                                        clearOnEscape
                                    />
                                </div>
                                <div className='flex flex-auto flex-col m-3' style={{minWidth: '240px'}}>
                                    <h1 className="font-bold">Complément d'adresse</h1>
                                    <Input
                                        value={props.dataForms.elements[key].value.line2}
                                        onChange={e => props.setDataForms({
                                            ...props.dataForms, elements: {
                                                ...props.dataForms.elements,
                                                [key]: {
                                                    ...props.dataForms.elements[key],
                                                    value: {
                                                        ...props.dataForms.elements[key].value,
                                                        line2: e.target.value
                                                    }
                                                    }
                                            }
                                        })}
                                        placeholder="Complément d'adresse"
                                        clearOnEscape
                                    />
                                </div>
                                <div className='flex flex-auto flex-col m-3' style={{minWidth: '240px'}}>
                                    <h1 className="font-bold">Ville</h1>
                                    <Input
                                        value={props.dataForms.elements[key].value.city}
                                        onChange={e => props.setDataForms({
                                            ...props.dataForms, elements: {
                                                ...props.dataForms.elements,
                                                [key]: {
                                                    ...props.dataForms.elements[key],
                                                    value: {
                                                        ...props.dataForms.elements[key].value,
                                                        city: e.target.value
                                                    }
                                                    }
                                            }
                                        })}
                                        placeholder='Ville'
                                        clearOnEscape
                                    />
                                </div> 
                                <div className='flex flex-auto flex-col m-3' style={{minWidth: '240px'}}>
                                    <h1 className="font-bold">Code Postal</h1>
                                    <Input
                                        value={props.dataForms.elements[key].value.PC}
                                        onChange={e => props.setDataForms({
                                            ...props.dataForms, elements: {
                                                ...props.dataForms.elements,
                                                [key]: {
                                                    ...props.dataForms.elements[key],
                                                    value: {
                                                        ...props.dataForms.elements[key].value,
                                                        PC: e.target.value
                                                    }
                                                    }
                                            }
                                        })}
                                        placeholder='Code Postal'
                                        clearOnEscape
                                    />
                                </div> 
                                <div className='flex flex-auto flex-col m-3' style={{minWidth: '240px'}}>
                                    <h1 className="font-bold">Pays</h1>
                                    <Input
                                        value={props.dataForms.elements[key].value.country}
                                        onChange={e => props.setDataForms({
                                            ...props.dataForms, elements: {
                                                ...props.dataForms.elements,
                                                [key]: {
                                                    ...props.dataForms.elements[key],
                                                    value: {
                                                        ...props.dataForms.elements[key].value,
                                                        country: e.target.value
                                                    }
                                                    }
                                            }
                                        })}
                                        placeholder='Pays'
                                        clearOnEscape
                                    />
                                </div> 
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <ModalButton kind={ButtonKind.tertiary} onClick={() => setIsOpen(false)}>
                                Annuler
                            </ModalButton>
                            <ModalButton onClick={() => setIsOpen(false)}>Modifier</ModalButton>
                        </ModalFooter>
                        </Modal>
                        <Input
                            value={props.dataForms.elements[key].value.line1 + ", " + props.dataForms.elements[key].value.line2 + ", " + props.dataForms.elements[key].value.city + ", " + props.dataForms.elements[key].value.PC + ", " + props.dataForms.elements[key].value.country}
                            disabled
                            onChange={e => props.setDataForms({
                                ...props.dataForms, elements: {
                                    ...props.dataForms.elements,
                                    [key]: {
                                        ...props.dataForms.elements[key],
                                        value: e.target.value,
                                        isValid: checkPassword(key, e.target.value),
                                        isConfirm: checkConfirm(key, e.target.value)
                                        }
                                }
                            })}
                            placeholder={element.placeholder}
                            clearOnEscape
                        >
                        </Input>
                        <Button
                            overrides={{
                            BaseButton: {
                                style: () => ({
                                    width: '100%'
                                })
                            }
                            }}
                            kind={'secondary'}
                            onClick={() => setIsOpen(true)}
                        >
                            Modifier une adresse
                        </Button>
                    </div>
                </FormControl>
            );
            case 'PasswordInput':
                return (
                    <FormControl
                        error={
                            (props.dataForms.elements[key].confirm && !props.dataForms.elements[key].isConfirm)
                            ? 'Les mots de passe ne correspondent pas !'
                            : (!props.dataForms.elements[key].isValid ? '8 caractères minimum !' : null)
                    }
                    >
                        <Input
                            value={props.dataForms.elements[key].value}
                            type="password"
                            onChange={e => props.setDataForms({
                                ...props.dataForms, elements: {
                                    ...props.dataForms.elements,
                                    [key]: {
                                        ...props.dataForms.elements[key],
                                        value: e.target.value,
                                        isValid: checkPassword(key, e.target.value),
                                        isConfirm: checkConfirm(key, e.target.value)
                                        }
                                }
                            })}
                            placeholder={element.placeholder}
                            clearOnEscape
                        />
                    </FormControl>
                );
            case 'SelectInput': 
                return(
                    <Select
                        clearable={false}
                        multi={props.dataForms.elements[key].multi}
                        options={props.dataForms.elements[key].options}
                        value={props.dataForms.elements[key].value}
                        placeholder={props.dataForms.elements[key].placeholder}
                        onChange={e => props.setDataForms({
                            ...props.dataForms, elements: {
                                ...props.dataForms.elements,
                                [key]: {
                                    ...props.dataForms.elements[key],
                                    value: e.value
                                }
                            }
                        })}
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
                        <div className="m-4 mt-8">
                            <FileUploader
                                  onDrop={(acceptedFiles, rejectedFiles) => {
                                    uploadFiles(key, acceptedFiles);
                                  }}
                                  progressMessage={
                                    isUploading ? `Upload...` : ''
                                  }
                                />
                        </div>
                    </div>
                );
            case 'Image':
                return (
                    <div className="flex flex-row justify-center" style={{width: '100%', height: '100%', minHeight: "200px", position: 'relative'}}>
                        <div className="m-2">
                            <Image objectFit="cover" src={process.env.NEXT_PUBLIC_CDN + props.dataForms.elements[key].src} alt="" layout="fill"/>
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
                    <HeadingSmall className='font-bold ml-4 mb-8 text-center uppercase'>{props.dataForms.title}</HeadingSmall>
                    <div className="flex flex-wrap">
                        {
                            Object.entries(props.dataForms.elements).map( ([key, element]) => (

                                <div className={element.fullWidth ? 'flex flex-auto flex-col m-3 w-full' : 'flex flex-auto flex-col m-3'} style={{minWidth: '240px'}}>
                                    <HeadingXSmall className="mb-4">{element.title}</HeadingXSmall>
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
