// @ts-check

import { IonPage, isPlatform } from '@ionic/react';
import { Button, KIND, SIZE } from 'baseui/button';
import { Card, StyledBody } from 'baseui/card';
import { Heading, HeadingLevel } from 'baseui/heading';
import { cart } from 'ionicons/icons';
import Image from 'next/image';
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import api from '../../../api';
import { Accordion, Panel } from 'baseui/accordion';

const Order = props => {
  var history = useHistory();
  const [orders, setOrders] = React.useState(null);

  var getOrders = async () => {
    var response = await api(
      'post',
      {
        query: `query ($filter: FilterFindManyOrderInput) {
          orders(filter: $filter) {
            _id
            userId
            createdAt
            tag
            restaurant {
              name
            }
            status {
              _id
            }
          }
        }`,
        variables: {
          // filter: {
          //   status: '62b74143f50332eb3572ff13',
          // },
        },
      },
      '',
      'Commandes récupérées !',
      false
    );
    if (response) {
      const orders = response.data.orders;
      setOrders(orders);
    }
  };

  const orderReady = async order => {
    const response = await api(
      'post',
      {
        query: `mutation($id: MongoID!, $record: UpdateByIdOrderInput!) {
          orderUpdateById(_id: $id, record: $record) {
            recordId
          }
        }`,
        variables: {
          id: order._id,
          record: {
            status: '62b74119f50332eb3572ff11',
          },
        },
      },
      '',
      'Commande marquée comme prête !',
      true
    );
    if (response) {
      getOrders();
    }
  };

  React.useEffect(() => {
    getOrders();
    console.log(orders);
  }, []);

  return (
    <IonPage className="overflow-y-auto mb-5 flex flex-col justify-center items-center">
      <div
        className="mb-5 flex flex-wrap align-center justify-center overflow-scroll"
        style={{ maxWidth: '500px' }}
      >
        {orders !== null && (
          <>
            {orders.length < 1 && (
              <div className="justify-center align-center items-center flex flex-auto">
                Aucune commande en attente.
              </div>
            )}
            {orders.filter(o => o.status._id === '62b74143f50332eb3572ff13').length > 0 && (
              <>
                <div className="justify-center align-center items-center flex flex-auto mt-10">
                  <HeadingLevel>
                    <Heading styleLevel={6}>Commandes en attente</Heading>
                  </HeadingLevel>
                </div>
                {orders
                  .filter(o => o.status._id === '62b74143f50332eb3572ff13')
                  .map(order => (
                    <>
                      <Card
                        className="m-3"
                        overrides={{
                          Root: {
                            style: {
                              top: '20px',
                              width: '95vw',
                            },
                          },
                        }}
                      >
                        <StyledBody className="flex flex-row align-middle items-center">
                          <div className="flex flex-row items-center" style={{ width: '100%' }}>
                            <div>
                              <h1 className="flex-1 mx-2 font-bold self-center text-center">
                                {order.restaurant.name}
                              </h1>
                            </div>
                            <div className="flex-1">
                              <h1 className="ml-auto">
                                Il y a{' '}
                                {Math.round(
                                  (new Date().getTime() - new Date(order.createdAt).getTime()) /
                                    1000 /
                                    60
                                )}{' '}
                                minutes
                              </h1>
                            </div>
                            <div className="flex-1">
                              <b>{order.tag}</b>
                            </div>
                            <div className="mr-4">
                              <Button
                                className="flex-1 m-2"
                                overrides={{
                                  BaseButton: {
                                    style: () => ({
                                      width: '100%',
                                      maxWidth: '100px',
                                    }),
                                  },
                                }}
                                size={SIZE.compact}
                                kind={KIND.primary}
                                onClick={() => orderReady(order)}
                              >
                                Préparée
                              </Button>
                            </div>
                          </div>
                        </StyledBody>
                      </Card>
                    </>
                  ))}
              </>
            )}
            {orders.filter(o => o.status._id === '62b74119f50332eb3572ff11').length > 0 && (
              <>
                <div className="justify-center align-center items-center flex flex-auto mt-10">
                  <HeadingLevel>
                    <Heading styleLevel={6}>Commandes prêtes</Heading>
                  </HeadingLevel>
                </div>
                {orders
                  .filter(o => o.status._id === '62b74119f50332eb3572ff11')
                  .map(order => (
                    <>
                      <Card
                        className="m-3"
                        overrides={{
                          Root: {
                            style: {
                              top: '20px',
                              width: '95vw',
                            },
                          },
                        }}
                      >
                        <StyledBody className="flex flex-row align-middle items-center">
                          <div className="flex flex-row items-center" style={{ width: '100%' }}>
                            <div>
                              <h1 className="flex-1 mx-2 font-bold self-center text-center">
                                {order.restaurant.name}
                              </h1>
                            </div>
                            <div className="flex-1">
                              <h1 className="ml-auto">
                                Il y a{' '}
                                {Math.round(
                                  (new Date().getTime() - new Date(order.createdAt).getTime()) /
                                    1000 /
                                    60
                                )}{' '}
                                minutes
                              </h1>
                            </div>
                            <div className="flex-1">
                              <b>{order.tag}</b>
                            </div>
                          </div>
                        </StyledBody>
                      </Card>
                    </>
                  ))}
              </>
            )}
          </>
        )}
      </div>
    </IonPage>
  );
};

export default Order;
