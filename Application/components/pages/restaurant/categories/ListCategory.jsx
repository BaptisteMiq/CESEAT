import { IonPage, isPlatform } from "@ionic/react";
import {Tag, VARIANT} from 'baseui/tag';
import TagKind from 'baseui/tag';
import { Button, KIND, SIZE } from "baseui/button";
import { Card, StyledAction, StyledBody } from "baseui/card";
import * as React from 'react';
import { useHistory } from "react-router-dom";
import api from "../../../api";

const ListCategory = (props) => {
    var history = useHistory();
    var [categories, setCategories] = React.useState([]);
    var [getCategorie, setGetCategorie] = React.useState(true);

    var getListOfCategories = async () => {

        var response = await api('post', {
            query: `query MyRestaurant {
                myRestaurant {
                  categories {
                    name
                    menus {
                      name
                      _id
                    }
                    products {
                      name
                      _id
                    }
                    _id
                  }
                }
              }`
        }, '', 'Liste des catégories bien récupérée !', false);
        if(response) {
            setCategories(response.data.myRestaurant.categories);
            setGetCategorie(false);
        }
    }

    var modifyCategory = (category) => {
        localStorage.setItem('modifyCategoryID', category._id);
        history.push({
            pathname: '/restaurant/category/modify',
            state: {categoryID: category._id}
        })
    }

    var addCategory = () => {
        history.push({
            pathname: '/restaurant/category/create'
        })
    }

    var redirectToProduct = (id) => {
        history.push({
            pathname: '/restaurant/product/modify',
            state: {productID: id}
        })
    }

    var redirectToMenu = (id) => {
        history.push({
            pathname: '/restaurant/menu/modify',
            state: {menuID: id}
        })
    }

    var deleteCategory = async (category) => {
        var response = await api('post', {
            query: `mutation DeleteCategoryFromMyRestaurant($deleteCategoryFromMyRestaurantId: MongoID!) {
                deleteCategoryFromMyRestaurant(id: $deleteCategoryFromMyRestaurantId) {
                  recordId
                }
              }`,
            variables: `
            {
                "deleteCategoryFromMyRestaurantId": "${category._id}"
            }
            `
        }, '', 'Catégorie ' + category.name + ' supprimé !', true);
        if(response) {
            setGetCategorie(true);
        }
    }
 
    React.useEffect(async () => {
        await getListOfCategories();
    }, [getCategorie])

    return (
        <IonPage className="top-14 overflow-y-auto mb-5 flex flex-col">
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
                    onClick={() => addCategory()}
                >
                    Ajout d'une catégorie
                </Button>
            </div>
            <div className="mb-6 flex flex-wrap align-center justify-center">
            {
                categories.map((category) => (
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
                            <h1 className="mx-2 font-bold self-center text-center">{category.name}</h1>
                        </div>
                        <div className="self-center flex flex-wrap justify-center m-1">
                            { category.menus.map(menu => (
                                <Tag
                                closeable={false}
                                kind="green"
                                onClick={() => redirectToMenu(menu._id)}
                                onActionClick={() => redirectToMenu(menu._id)}
                                variant={VARIANT.solid}
                              >
                                {menu.name}
                              </Tag>
                            ))}
                        </div>
                        <div className="self-center flex flex-wrap justify-center m-1">
                            { category.products.map(product => (
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
                                    onClick={() => modifyCategory(category)}
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
                                    onClick={() => deleteCategory(category)}
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

export default ListCategory;
