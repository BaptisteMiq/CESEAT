import { IonPage, isPlatform } from "@ionic/react";
import { Button, KIND, SIZE } from "baseui/button";
import { Card, StyledBody } from "baseui/card";
import Image from 'next/image';
import * as React from 'react';
import { useHistory } from "react-router-dom";
import api from "../../../api";
import { defaultImage } from "../../../ui/Images";

const ListProduct = (props) => {
    var history = useHistory();
    var [products, setProducts] = React.useState([]);
    var [getProducts, setGetProducts] = React.useState(true);

    var getListOfProducts = async () => {

        var response = await api('post', {
            query: `query Products {
                myRestaurant {
                  products {
                    _id
                    name
                    description
                    price
                    picture
                    allergenicIngredients
                    available
                    createdAt
                  }
                }
              }`
        }, '', 'Liste des produits bien récupérée !', false);
        if(response) {
            setProducts(response.data.myRestaurant.products);
            setGetProducts(false);
        }
    }

    var addProduct = () => {
        history.push('/restaurant/product/create');
    }

    var modifyProduct = (product) => {
        localStorage.setItem('modifyProductID', product._id);
        history.push({
            pathname: '/restaurant/product/modify',
            state: {productID: product._id}
        })
    }

    var deleteProduct = async (product) => {
        var response = await api('post', {
            query: `mutation DeleteProductFromMyRestaurant($deleteProductFromMyRestaurantId: MongoID!) {
                deleteProductFromMyRestaurant(id: $deleteProductFromMyRestaurantId) {
                  recordId
                }
              }`,
            variables: `
            {
                "deleteProductFromMyRestaurantId": "${product._id}"
            }
            `
        }, '', 'Produit ' + product.name + ' supprimé !', true);
        if(response) {
            setGetProducts(true);
        }
    }
 
    React.useEffect(async () => {
        await getListOfProducts();
    }, [getProducts]);

    return (
        <IonPage className="top-14 mb-20 overflow-y-auto mb-5 flex flex-col">
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
                    onClick={() => addProduct()}
                >
                    Ajout d'un produit
                </Button>
            </div>
            <div className="mb-5 flex flex-wrap align-center justify-center">
            {
                products.map((product) => (
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
                                <Image className="" objectFit="cover" src={process.env.NEXT_PUBLIC_CDN + product.picture ?? defaultImage} alt="" height="60px" width="60px" />
                            </div>
                        </div>
                        <div className="w-1/2 flex flex-row flex-wrap">
                            <div className={isPlatform('desktop') ? "w-2/6 self-center" : "w-1/2 self-center"}>
                                <h1 className="mx-2 font-bold self-center text-center">{product.name}</h1>
                            </div>
                            {isPlatform('desktop') &&
                                <div className="w-2/6 self-center">
                                    <h1 className="ml-auto">{product.description}</h1>
                                </div>
                            }
                            <div className={isPlatform('desktop') ? "w-1/6 self-center" : "w-1/2 self-center"}>
                                <h1 className="ml-auto text-center">{product.price}</h1>
                            </div>
                            <div className={isPlatform('desktop') ? "w-1/6 self-center" : "w-1/2 self-center"}>
                                <h1 className="ml-auto text-center">{product.available ? "Disponible" : "Indisponible"}</h1>
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
                                onClick={() => modifyProduct(product)}
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
                                onClick={() => deleteProduct(product)}
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

export default ListProduct;
