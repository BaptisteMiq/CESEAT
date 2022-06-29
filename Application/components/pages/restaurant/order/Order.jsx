import { IonPage } from '@ionic/react';
import { Button, KIND, SIZE } from 'baseui/button';
import { Card, StyledBody } from 'baseui/card';
import { Heading, HeadingLevel } from 'baseui/heading';
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import api from '../../../api';
import { SocketContext } from '../../../AppShell';
import { newNotification } from '../../../ui/Notifs';

const Order = props => {
  var history = useHistory();
  const [orders, setOrders] = React.useState(null);
  const socket = React.useContext(SocketContext);

  React.useEffect(() => {
    socket.on('orderStatus', data => {
      if (window.location.href.includes(data.to)) {
        newNotification(data.message);
        getOrders();
      }
    });
  }, []);

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
            cart {
              products {
                name
              }
              menus {
                name
              }
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
      console.log(response);
      const orders = response.data.orders.filter(order => order.cart);
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
      socket.emit('orderStatus', {
        to: 'users',
        message: `La commande ${order.tag} vient d'être annulée par le restaurateur.`,
      });
      socket.emit('orderStatus', {
        to: 'delivery',
        message: ``,
      });
      getOrders();
    }
  };

  const orderBeingDelivered = async order => {
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
      socket.emit('orderStatus', {
        to: 'delivery',
        message: `Une nouvelle commande est disponible !`,
      });
      socket.emit('orderStatus', {
        to: 'users',
        message: ``,
      });
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
                        <StyledBody className="flex flex-col align-middle items-center">
                          <div className="flex flex-row items-center" style={{ width: '100%' }}>
                            <div>
                              {/* <h1 className="flex-1 mx-2 font-bold self-center text-center">
                                {order.restaurant.name}
                              </h1> */}
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
                              N° <b>{order.tag}</b>
                            </div>
                          </div>
                          <div
                            className="flex flex-row items-center mt-4"
                            style={{ width: '100%' }}
                          >
                            <div
                              className="flex flex-row items-center justify-center ml-auto mr-auto"
                              style={{ width: '100%' }}
                            >
                              <table className="restaurant-table">
                                {order.cart.products.length > 0 && (
                                  <>
                                    <thead>
                                      <tr>
                                        <th>Produits</th>
                                        <th>Quantité</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {order.cart.products.map(product => (
                                        <tr>
                                          <td>{product.name}</td>
                                          <td>x1</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </>
                                )}
                                {order.cart.menus.length > 0 && (
                                  <>
                                    <thead>
                                      <tr>
                                        <th>Menus</th>
                                        <th>Quantité</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {order.cart.menus.map(menu => (
                                        <tr>
                                          <td>{menu.name}</td>
                                          <td>x1</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </>
                                )}
                              </table>
                            </div>
                          </div>
                          <div className="justify-center align-center items-center flex flex-auto mt-4">
                            <Button
                              className="m-2"
                              size={SIZE.compact}
                              kind={KIND.primary}
                              onClick={() => orderBeingDelivered(order)}
                            >
                              Commande prête
                            </Button>
                            <Button
                              className="m-2"
                              size={SIZE.compact}
                              kind={KIND.secondary}
                              onClick={() => cancelOrder(order)}
                            >
                              Annuler
                            </Button>
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
                                Attente d'un livreur...
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
