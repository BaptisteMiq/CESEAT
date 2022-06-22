import { IonPage, isPlatform } from "@ionic/react";
import { Button, KIND, SIZE } from "baseui/button";
import { Card, StyledBody } from "baseui/card";
import Image from 'next/image';
import * as React from 'react';
import { useHistory } from "react-router-dom";
import api from "../../../api";

const ListProduct = (props) => {
    var history = useHistory();
    var [products, setProducts] = React.useState([]);
    var [getProducts, setGetProducts] = React.useState(true);

    var getListOfProducts = async () => {

        var response = await api('post', {
            query: `query Query {
                products {
                  name
                  description
                  price
                  picture
                  createdAt
                  allergenicIngredients
                  available
                  _id
                }
              }`
        }, '', 'Liste des utilisateurs bien récupérée !', false);
        if(response) {
            setProducts(response.data.products);
            setGetProducts(false);
        }
    }
    // await axios({
    //     url: 'http://localhost:4000/graphql',
    //     method: 'post',
    //     data: {
    //         query: `query Query {
    //             users {
    //               ID
    //               Firstname
    //               Lastname
    //               Password
    //               Mail
    //               PhoneNumber
    //               Avatar
    //               Role_ID
    //             }
    //           }`
    //     }
    //   }).then(response => {
    //     setUsers(response.data.data.users);
    //     setGetUsers(false);
    //   })
    // }

    var modifyUser = (user) => {
        history.push({
            pathname: '/restaurant/product/modify',
            state: {userID: user.ID}
        })
    }

    var deleteUser = async (product) => {
        console.log(product);
        var response = await api('post', {
            query: `mutation ProductDeleteById($id: MongoID!) {
                productDeleteById(_id: $id) {
                  record {
                    _id
                  }
                }
              }`,
            variables: `
            {
                "id": "${product._id}"
            }
            `
        }, '', 'Produit ' + product.name + ' supprimé !', true);
        if(response) {
            setGetProducts(true);
        }
    }
 
    React.useEffect(async () => {
        await getListOfProducts();
    }, [getProducts])

    return (
        <IonPage className="overflow-y-auto mb-5 flex flex-col">
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
                                <Image className="" objectFit="cover" src={product.Image ? product.Image : "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"} alt="" height="60px" width="60px" />
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
                            <div className={isPlatform('desktop') ? "w-2/6 self-center" : "w-1/2 self-center"}>
                                <h1 className="ml-auto text-center">{product.price}</h1>
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
                                onClick={() => modifyUser(product)}
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
                                onClick={() => deleteUser(product)}
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
