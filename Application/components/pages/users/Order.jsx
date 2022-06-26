// @ts-check

import { IonPage, isPlatform } from '@ionic/react';
import { Button, KIND, SIZE } from 'baseui/button';
import { Card, StyledBody } from 'baseui/card';
import { Heading, HeadingLevel } from 'baseui/heading';
import { cart } from 'ionicons/icons';
import Image from 'next/image';
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import api from '../../api';
import { Accordion, Panel } from 'baseui/accordion';

const Order = props => {
  var history = useHistory();
  const [orders, setOrders] = React.useState(null);

  var getOrders = async () => {
    var response = await api(
      'post',
      {
        query: `query Query {
          myOrders {
            _id
            userId
            restaurant {
              name
              address {
                line1
                line2
                PC
                city
              }
            }
            cart {
              menus {
                name
                price
              }
              products {
                name
                price
              }
            }
            tag
            createdAt
            additionalInfo
            status {
              _id
              label
              description
            }
          }
              }`,
      },
      '',
      'Paniers récupérés !',
      false
    );
    if (response) {
      const orders = response.data.myOrders;
      setOrders(orders);
    }
  };

  const cancelOrder = async order => {
    const response = await api(
      'post',
      {
        query: `mutation Mutation {
            orderDeleteById(_id: "${order._id}") {
              recordId
            }
          }
        `,
      },
      '',
      'Commande annulée !',
      true
    );
    if (response) {
      getOrders();
    }
  };

  React.useEffect(() => {
    getOrders();
  }, []);

  return (
    <IonPage className="overflow-y-auto mb-5 flex flex-col justify-center items-center">
      <div
        className="mb-5 flex flex-wrap align-center justify-center overflow-scroll"
        style={{ maxWidth: '500px' }}
      >
        {orders !== null && (
          <>
            {orders.length < 1 ? (
              <div className="justify-center align-center items-center flex flex-auto">
                <h1>Aucune commande en cours.</h1>
              </div>
            ) : (
              orders.map(order => (
                <div>
                  {order.status._id === '62b74143f50332eb3572ff13' ? (
                    <div>
                      <div className="justify-center align-center items-center flex flex-auto flex-col mt-10 mb-5 text-center">
                        <HeadingLevel>
                          <Heading styleLevel={3}>
                            Commande chez <u>{order.restaurant.name}</u>
                          </Heading>
                          <Heading className="mt-4" styleLevel={5}>
                            Commande en cours de préparation...
                          </Heading>
                          <p className="mt-4">
                            Le plat est en train d'être cuisiné par le restaurateur.
                          </p>
                          <div className="justify-center align-center items-center flex flex-auto my-10">
                            <Image src="/img/cuisson.gif" height="180" width="180" />
                          </div>
                          <p className="mt-2">
                            Vous serez notifié lorsqu'un livreur sera en route pour vous le livrer.
                          </p>
                        </HeadingLevel>
                      </div>
                    </div>
                  ) : order.status._id === '62b74119f50332eb3572ff11' ? (
                    <div>
                      <div className="justify-center align-center items-center flex flex-auto flex-col mt-10 mb-5 text-center">
                        <HeadingLevel>
                          <Heading styleLevel={3}>
                            Commande chez <u>{order.restaurant.name}</u>
                          </Heading>
                          <Heading className="mt-4" styleLevel={5}>
                            Commande prête, en attente d'un livreur...
                          </Heading>
                          <p className="mt-4">
                            Le plat a été préparé par le restaurateur, nous recherchons un livreur
                            pour vous aller vous le livrer.
                          </p>
                          <div className="justify-center align-center items-center flex flex-auto my-10">
                            <Image src="/img/radar.gif" height="180" width="180" />
                          </div>
                          <p className="mt-2">Vous serez notifié lorsqu'un livreur sera trouvé.</p>
                        </HeadingLevel>
                      </div>
                    </div>
                  ) : order.status._id === '62b7416df50332eb3572ff15' ? (
                    <div>
                      <div className="justify-center align-center items-center flex flex-auto flex-col mt-10 mb-5 text-center">
                        <HeadingLevel>
                          <Heading styleLevel={3}>
                            Commande chez <u>{order.restaurant.name}</u>
                          </Heading>
                          <Heading className="mt-4" styleLevel={5}>
                            Votre livreur est en route!
                          </Heading>
                          <p className="mt-4">
                            Votre livreur <b>{'Michel Depuis'}</b> est en route pour aller chercher
                            votre plat.
                          </p>
                          <div className="justify-center align-center items-center flex flex-auto my-10">
                            <Image src="/img/cyclisme.gif" height="180" width="180" />
                          </div>
                        </HeadingLevel>
                      </div>
                    </div>
                  ) : order.status._id === '62b74190f50332eb3572ff17' ? (
                    <div>
                      <div className="justify-center align-center items-center flex flex-auto flex-col mt-10 mb-5 text-center">
                        <HeadingLevel>
                          <Heading styleLevel={3}>
                            Commande chez <u>{order.restaurant.name}</u>
                          </Heading>
                          <Heading className="mt-4" styleLevel={5}>
                            Votre livreur est en route!
                          </Heading>
                          <p className="mt-4">
                            Votre livreur <b>{'Michel Depuis'}</b> vient de récupérer la commande
                            aurpès du restaurant et est en route vers chez vous.
                          </p>
                          <div className="justify-center align-center items-center flex flex-auto my-10">
                            <Image src="/img/cyclisme.gif" height="180" width="180" />
                          </div>
                          <p className="mt-2">Vous serez notifié lorsqu'il sera arrivé.</p>
                        </HeadingLevel>
                      </div>
                    </div>
                  ) : order.status._id === '62b7419ff50332eb3572ff19' ? (
                    <div>
                      <div className="justify-center align-center items-center flex flex-auto flex-col mt-10 mb-5 text-center">
                        <HeadingLevel>
                          <Heading styleLevel={3}>
                            Commande chez <u>{order.restaurant.name}</u>
                          </Heading>
                          <Heading className="mt-4" styleLevel={5}>
                            Commande récupérée!
                          </Heading>
                          <p className="mt-4">Merci d'avoir fait confiance à nos service.</p>
                          <div className="justify-center align-center items-center flex flex-auto my-10">
                            <Image src="/img/content.gif" height="180" width="180" />
                          </div>
                          <p className="mt-2">Vous serez notifié lorsqu'il sera arrivé.</p>
                        </HeadingLevel>
                      </div>
                    </div>
                  ) : (
                    ''
                  )}
                  <Accordion>
                    <Panel title="Récapitulatif de la commande">
                      <div className="justify-center align-center items-center flex flex-auto flex-col">
                        <HeadingLevel>
                          <Heading styleLevel={6}>
                            Commande passée chez <b>{order.restaurant.name}</b>
                          </Heading>
                        </HeadingLevel>
                        <div className="justify-center align-center items-center flex flex-auto flex-col my-2">
                          <p>
                            {order.restaurant.address.line1}, {order.restaurant.address.line2},{' '}
                            {order.restaurant.address.PC} {order.restaurant.address.city}
                          </p>
                        </div>
                        <div className="flex flex-wrap flex-col">
                          {order.cart.products.concat(order.cart.menus).map(item => (
                            <p>
                              1x {item.name} - {item.price}€
                            </p>
                          ))}
                        </div>
                        <p>
                          Prix total de la commande :{' '}
                          {order.cart.products
                            .concat(order.cart.menus)
                            .reduce((a, b) => a + b.price, 0)}
                          €
                        </p>
                        <p>{order.additionalInfo}</p>
                      </div>
                    </Panel>
                  </Accordion>
                  <div className="justify-center align-center items-center flex flex-auto flex-col my-2">
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
                      size={SIZE.compact}
                      kind={KIND.primary}
                      onClick={() => cancelOrder(order)}
                    >
                      Annuler la commande
                    </Button>
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </IonPage>
  );
};

export default Order;
