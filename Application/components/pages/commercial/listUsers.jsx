import { IonPage, isPlatform } from "@ionic/react";
import { Button, KIND, SIZE } from "baseui/button";
import { Card, StyledBody } from "baseui/card";
import Image from 'next/image';
import * as React from 'react';
import { useHistory } from "react-router-dom";
import api from "../../api";
import { defaultUserImage } from "../../ui/Images";

const ListUsers = (props) => {
    console.log('test');
    var history = useHistory();
    var [users, setUsers] = React.useState([]);
    var [getUsers, setGetUsers] = React.useState(true);

    var getusers = async () => {

        var response = await api('post', {
            query: `query Query {
                users {
                  ID
                  Firstname
                  Lastname
                  Password
                  Mail
                  PhoneNumber
                  Avatar
                  Role_ID
                }
              }`
        }, '', 'Liste des utilisateurs bien récupérée !', false);
        if(response) {
            setUsers(response.data.users ? response.data.users : []);
            setGetUsers(false);
        }
    }

    var modifyUser = (user) => {
        localStorage.setItem('modifyUserID', user.ID);
        history.push({
            pathname: '/users/modify',
            state: {userID: user.ID}
        })
    }

    var deleteUser = async (user) => {
        var response = await api('post', {
            query: `mutation UserDeleteById($id: String) {
                userDeleteById(ID: $id) {
                  record {
                    ID
                  }
                }
            }`,
            variables: `
            {
                "id": "${user.ID}"
            }
            `
        }, '', 'Utilisateur ' + user.Mail + ' supprimé !', true);
        if(response) {
            setGetUsers(true);
        }
    }
 
    React.useEffect(async () => {
        await getusers();
    }, [getUsers])
    return (
        <IonPage className="top-14 mb-20 overflow-y-auto mb-5 flex flex-col">
            <div className="mb-5 flex flex-wrap align-center justify-center">
            {
                users.map((user) => (
                <Card
                    className="m-3"
                    overrides={{
                        Root: {
                        style: {
                            top: "20px",
                            width: "95vw"
                        }
                        }
                    }}
                >
                    <StyledBody className="flex flex-row flex-wrap align-middle items-center">
                        <div className="w-1/6 flex justify-center">
                            <div>
                                <Image className="" objectFit="cover" src={process.env.NEXT_PUBLIC_CDN + (user.Avatar ?? defaultUserImage)} alt="" height="60px" width="60px" />
                            </div>
                        </div>
                        <div className="w-1/2 flex flex-row flex-wrap">
                            <div className={isPlatform('desktop') ? "w-2/6 self-center" : "w-1/2 self-center"}>
                                <h1 className="mx-2 font-bold self-center text-center">{user.Lastname} {user.Firstname}</h1>
                            </div>
                            {isPlatform('desktop') &&
                                <div className="w-2/6 self-center">
                                    <h1 className="ml-auto">{user.Mail}</h1>
                                </div>
                            }
                            <div className={isPlatform('desktop') ? "w-2/6 self-center" : "w-1/2 self-center"}>
                                <h1 className="ml-auto text-center">{user.Role_ID}</h1>
                            </div>
                        </div>
                        <div className="w-2/6 flex flex-row flex-wrap justify-end">
                            <Button
                                className="m-2"
                                overrides={{
                                BaseButton: {
                                    style: () => ({
                                        width: '100%',
                                        maxWidth: '100px'
                                    })
                                }
                                }}
                                kind={KIND.primary}
                                size={SIZE.compact}
                                onClick={() => modifyUser(user)}
                            >
                                Modifier
                            </Button>
                            <Button
                                className="m-2"
                                overrides={{
                                BaseButton: {
                                    style: () => ({
                                        width: '100%',
                                        maxWidth: '100px',
                                        backgroundColor: "red"
                                    })
                                }
                                }}
                                size={SIZE.compact}
                                kind={KIND.primary}
                                onClick={() => deleteUser(user)}
                            >
                                Supprimer
                            </Button>
                        </div>
                    </StyledBody>
                </Card>
            ))

        }
        </div>
        </IonPage>
    );
};

export default ListUsers;
