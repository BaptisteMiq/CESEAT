import { IonPage, isPlatform } from "@ionic/react";
import {Tag, VARIANT} from 'baseui/tag';
import TagKind from 'baseui/tag';
import { Button, KIND, SIZE } from "baseui/button";
import { Card, StyledAction, StyledBody } from "baseui/card";
import * as React from 'react';
import { useHistory } from "react-router-dom";
import api from "../../../api";

const ListMenu = (props) => {
    var history = useHistory();
    var [menus, setMenu] = React.useState([]);
    var [getMenu, setGetMenu] = React.useState(true);

    var getListOfMenu = async () => {

        var response = await api('post', {
            query: `query Menus {
                menus {
                  name
                  description
                  price
                  picture
                  createdAt
                  available
                  _id
                  products {
                    _id
                    name
                  }
                }
              }`
        }, '', 'Liste des menus bien récupérée !', false);
        if(response) {
            setMenu(response.data.menus);
            setGetMenu(false);
        }
    }

    var modifyMenu = (menu) => {
        localStorage.setItem('modifyMenuID', menu._id);
        history.push({
            pathname: '/restaurant/menu/modify',
            state: {menuID: menu._id}
        })
    }

    var addAddress = () => {
        history.push({
            pathname: '/restaurant/menu/create'
        })
    }

    var redirectToProduct = (id) => {
        history.push({
            pathname: '/restaurant/product/modify',
            state: {productID: id}
        })
    }

    var deleteMenu = async (menu) => {
        var response = await api('post', {
            query: `mutation menuDeleteById($id: MongoID!) {
                menuDeleteById(_id: $id) {
                  record {
                    _id
                  }
                }
              }`,
            variables: `
            {
                "id": "${menu._id}"
            }
            `
        }, '', 'Menu ' + menu.name + ' supprimé !', true);
        if(response) {
            setGetMenu(true);
        }
    }
 
    React.useEffect(async () => {
        await getListOfMenu();
    }, [getMenu])

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
                    Ajout d'un menu
                </Button>
            </div>
            <div className="mb-6 flex flex-wrap align-center justify-center">
            {
                menus.map((menu) => (
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
                        <div className="self-center m-1">
                            <h1 className="mx-2 font-bold self-center text-center">{menu.name}</h1>
                        </div>
                        <div className="self-center m-1">
                            <h1 className="mx-2 self-center text-center">{menu.description}</h1>
                        </div>
                        <div className="self-center m-1">
                            <h1 className="ml-auto">{menu.price} €</h1>
                        </div>
                        <div className="self-cente m-1">
                            <h1 className={menu.available ?  "ml-auto text-center text-green-600" : "ml-auto text-center text-red-600"}>{menu.available ? "Disponible" : "Indisponible"}</h1>
                        </div>
                        <div className="self-center flex flex-wrap justify-center m-1">
                            { menu.products.map(product => (
                                <Tag
                                closeable={false}
                                kind="primary"
                                onClick={() => redirectToProduct(product._id)}
                                onActionClick={() => redirectToProduct(product._id)}
                                variant={VARIANT.solid}
                              >
                                {product.name}
                              </Tag>
                            ))}
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
                                    onClick={() => modifyMenu(menu)}
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
                                    onClick={() => deleteMenu(menu)}
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

export default ListMenu;
