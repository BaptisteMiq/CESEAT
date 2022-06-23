import { IonPage, isPlatform } from "@ionic/react";
import { Button, KIND, SIZE } from "baseui/button";
import { Card, StyledAction, StyledBody } from "baseui/card";
import * as React from 'react';
import { useHistory } from "react-router-dom";
import api from "../../api";

const ListAddress = (props) => {
    var history = useHistory();
    var [address, setAddress] = React.useState([]);
    var [getAddress, setGetAddress] = React.useState(true);

    var getListOfAddress = async () => {

        var response = await api('post', {
            query: `query Query {
                addresses {
                  line1
                  line2
                  city
                  PC
                  country
                  _id
                }
              }`
        }, '', 'Liste des adresses bien récupérée !', false);
        if(response) {
            setAddress(response.data.addresses);
            setGetAddress(false);
        }
    }

    var modifyAddress = (address) => {
        localStorage.setItem('modifyAddressID', address._id);
        history.push({
            pathname: '/users/address/modify',
            state: {addressID: address._id}
        })
    }

    var addAddress = () => {
        history.push({
            pathname: '/users/address/create'
        })
    }

    var deleteAddress = async (address) => {
        var response = await api('post', {
            query: `mutation AddressDeleteById($id: MongoID!) {
                addressDeleteById(_id: $id) {
                  record {
                    _id
                  }
                }
              }`,
            variables: `
            {
                "id": "${address._id}"
            }
            `
        }, '', 'Adresse ' + address.line1 + ' supprimé !', true);
        if(response) {
            setGetAddress(true);
        }
    }
 
    React.useEffect(async () => {
        await getListOfAddress();
    }, [getAddress])
    return (
        <IonPage className="overflow-y-auto mb-5 flex flex-col">
            <div className="justify-center align-center items-center flex flex-auto">
                <Button
                    className="m-2"
                    overrides={{
                    BaseButton: {
                        style: () => ({
                            width: '100%',
                            maxWidth: '200px'
                        })
                    }
                    }}
                    size={SIZE.default}
                    kind={KIND.primary}
                    onClick={() => addAddress()}
                >
                    Ajout d'une adresse
                </Button>
            </div>
            <div className="mb-6 flex flex-wrap align-center justify-center">
            {
                address.map((add) => (
                <Card
                    className="m-3"
                    overrides={{
                        Root: {
                        style: {
                            top: "20px",
                            width: "30%",
                            minWidth: "240px"
                        }
                        }
                    }}
                >
                    <StyledBody className="flex flex-wrap flex-col align-middle items-center">
                        <div className="self-center">
                            <h1 className="mx-2 font-bold self-center text-center">{add.line1}</h1>
                        </div>
                        <div className="self-center">
                            <h1 className="mx-2 font-bold self-center text-center">{add.line2}</h1>
                        </div>
                        <div className="self-center">
                            <h1 className="ml-auto">{add.PC}, {add.city}</h1>
                        </div>
                        <div className="self-center">
                            <h1 className="ml-auto text-center">{add.country}</h1>
                        </div>
                        </StyledBody>
                        <StyledAction className="">
                            <div className="flex flex-row justify-end">
                                <Button
                                    className="m-2"
                                    overrides={{
                                    BaseButton: {
                                        style: () => ({
                                            width: '100%',
                                        })
                                    }
                                    }}
                                    kind={KIND.primary}
                                    size={SIZE.compact}
                                    onClick={() => modifyAddress(add)}
                                >
                                    Modifier
                                </Button>
                                <Button
                                    className="m-2"
                                    overrides={{
                                    BaseButton: {
                                        style: () => ({
                                            width: '100%',
                                            backgroundColor: "red"
                                        })
                                    }
                                    }}
                                    size={SIZE.compact}
                                    kind={KIND.primary}
                                    onClick={() => deleteAddress(add)}
                                >
                                    Supprimer
                                </Button>
                            </div>
                        </StyledAction>
                </Card>
            ))

        }
        </div>
        </IonPage>
    );
};

export default ListAddress;
