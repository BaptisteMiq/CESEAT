import { IonPage } from "@ionic/react";
import { Button, KIND } from "baseui/button";
import { Card, StyledAction, StyledBody } from "baseui/card";
import { FileUploader } from "baseui/file-uploader";
import { Input } from 'baseui/input';
import {validate as validateEmail} from 'email-validator';
import {FormControl} from 'baseui/form-control';
import { PhoneInput, StyledFlag } from "baseui/phone-input";
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
                    />
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
                    <HeadingSmall className='font-bold ml-4 mb-8 text-center uppercase'>{props.dataForms.title}</HeadingSmall>
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
