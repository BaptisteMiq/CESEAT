import { IonPage, isPlatform } from '@ionic/react';
import { Button, KIND, SIZE } from 'baseui/button';
import { Card, StyledBody } from 'baseui/card';
import { Heading, HeadingLevel } from 'baseui/heading';
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import api from '../../api';
const Cart = props => {
  var history = useHistory();
  const [carts, setCarts] = React.useState(null);

  // 62b74143f50332eb3572ff13

  const takeOrder = async (restaurantId, cartId) => {
    var response = await api(
      'post',
      {
        query: `mutation MyOrderCreateOne($record: CreateOneOrderInput!) {
            myOrderCreateOne(record: $record) {
              recordId
              record {
                tag
              }
            }
          }`,
        variables: `{
            "record": {
              "restaurant": "${restaurantId}",
              "cart": "${cartId}",
              "additionalInfo": "",
              "status": "62b74143f50332eb3572ff13"
            }
          }`,
      },
      '',
      'Commande bien enregistrée !',
      true
    );

    if (response) {
      history.push('/users/orders');
    }
  };

  var getCarts = async () => {
    var response = await api(
      'post',
      {
        query: `query Query {
                myCarts {
                    _id
                    isOrdered
                    restaurant {
                        _id
                        name
                      }
                  products {
                    _id
                    name
                    price
                  }
                  menus {
                    _id
                    name
                    price
                  }
                }
              }`,
      },
      '',
      'Paniers récupérés !',
      false
    );
    if (response) {
      const carts = response.data.myCarts.filter(cart => !cart.isOrdered);
      // Remove carts with no products or menus
      const cartsWithItems = carts.filter(cart => {
        return cart.products.length > 0 || cart.menus.length > 0;
      });
      setCarts(cartsWithItems);
    }
  };

  const removeItemFromCart = async (cart, itemId) => {
    var response = await api(
      'post',
      {
        query: `mutation Mutation($id: MongoID!, $record: UpdateByIdCartInput!) {
                myCartUpdateById(_id: $id, record: $record) {
                    recordId
                }
            }`,
        variables: `{
                "id": "${cart._id}",
                "record": {
                    "products": ${JSON.stringify(
                      cart.products.filter(p => p._id !== itemId).map(p => p._id)
                    )},
                    "menus": ${JSON.stringify(
                      cart.menus.filter(m => m._id !== itemId).map(m => m._id)
                    )}
                }
            }`,
      },
      '',
      'Supprimé du panier !',
      false
    );
    if (response) {
      getCarts();
    }
  };

  React.useEffect(() => {
    getCarts();
  }, []);

  return (
    <IonPage className="overflow-y-auto mb-5 flex flex-col justify-center items-center">
      <div
        className="mb-5 flex flex-wrap align-center justify-center overflow-scroll"
        style={{ width: '500px' }}
      >
        {carts !== null && (
          <>
            {carts.map(cart => cart.products.concat(cart.menus)).flat().length < 1 ? (
              <div className="justify-center align-center items-center flex flex-auto mt-10">
                <h1>Votre panier est vide.</h1>
              </div>
            ) : (
              <>
                {carts.map(cart => (
                  <>
                    <div className="justify-center align-center items-center flex flex-auto mt-10 mb-5">
                      <HeadingLevel>
                        <Heading styleLevel={4}>
                          Panier de <u>{cart.restaurant.name}</u>
                        </Heading>
                      </HeadingLevel>
                    </div>
                    {cart.products.concat(cart.menus).map(item => (
                      <Card
                        className="m-3"
                        overrides={{
                          Root: {
                            style: {
                              top: '20px',
                              width: '100%',
                            },
                          },
                        }}
                      >
                        <StyledBody className="flex flex-row flex-wrap align-middle items-center">
                          <div className="w-1/6 flex justify-center">
                            <div>
                              {/* <Image
                    className=""
                    objectFit="cover"
                    src={
                      cart.Image
                        ? cart.Image
                        : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
                    }
                    alt=""
                    height="60px"
                    width="60px"
                  /> */}
                            </div>
                          </div>
                          <div className="w-1/2 flex flex-row flex-wrap">
                            <div
                              className={
                                isPlatform('desktop') ? 'w-2/2 self-center' : 'w-1/2 self-center'
                              }
                            >
                              <h1 className="mx-2 font-bold self-center text-center">
                                1x {item.name}
                              </h1>
                            </div>
                            <div
                              className={
                                isPlatform('desktop') ? 'w-1/6 self-center' : 'w-1/2 self-center'
                              }
                            >
                              <h1 className="ml-auto text-center">{item.price}€</h1>
                            </div>
                          </div>
                          <div className="w-2/6 flex flex-row flex-wrap justify-end">
                            <Button
                              className="m-2"
                              overrides={{
                                BaseButton: {
                                  style: () => ({
                                    width: '100%',
                                    maxWidth: '100px',
                                    backgroundColor: 'red',
                                  }),
                                },
                              }}
                              size={SIZE.compact}
                              kind={KIND.primary}
                              onClick={() => removeItemFromCart(cart, item._id)}
                            >
                              Supprimer
                            </Button>
                          </div>
                        </StyledBody>
                      </Card>
                    ))}
                    <div className="justify-center align-center items-center flex flex-auto mt-10">
                      <p>
                        Sous-total :{' '}
                        <b>
                          {' '}
                          {cart.products
                            .concat(cart.menus)
                            .flat()
                            .reduce((acc, item) => acc + item.price, 0)}
                          €
                        </b>
                      </p>
                    </div>
                    <div className="justify-center align-center items-center flex flex-auto mt-10">
                      <Button
                        className="mt-2 m-2"
                        overrides={{
                          BaseButton: {
                            style: () => ({
                              width: '100%',
                              maxWidth: '200px',
                            }),
                          },
                        }}
                        size={SIZE.default}
                        kind={KIND.primary}
                        onClick={() => takeOrder(cart.restaurant._id, cart._id)}
                      >
                        Passer commande
                      </Button>
                    </div>
                  </>
                ))}
              </>
            )}
          </>
        )}
        {/* <div className="justify-center align-center items-center flex flex-auto">
          <Button
            className="mt-4 m-4"
            overrides={{
              BaseButton: {
                style: () => ({
                  width: '100%',
                  maxWidth: '200px',
                }),
              },
            }}
            size={SIZE.default}
            kind={KIND.secondary}
            onClick={() => {}}
          >
            Ajouter un produit au panier
          </Button>
        </div> */}
      </div>
    </IonPage>
  );
};

export default Cart;
