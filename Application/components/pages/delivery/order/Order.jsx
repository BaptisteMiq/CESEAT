import { IonPage } from '@ionic/react';
import { Button, KIND, SIZE } from 'baseui/button';
import { Card, StyledBody } from 'baseui/card';
import { Heading, HeadingLevel } from 'baseui/heading';
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import api from '../../../api';
import Map, { Marker } from 'react-map-gl';
import { FloatingMarker } from 'baseui/map-marker';
import { SocketContext } from '../../../AppShell';
import { newNotification } from '../../../ui/Notifs';
import 'mapbox-gl/dist/mapbox-gl.css';
const MAPBOX_TOKEN =
  'pk.eyJ1IjoiYmFwdGlzdGVtaXEiLCJhIjoiY2w0eDR4ajdoMXBycDNiczNzMWN4MmluaCJ9.dUK_Iwd3kbuJfe4iYgXVrQ';

const Order = props => {
  var history = useHistory();
  const [orders, setOrders] = React.useState(null);
  const [currentOrder, setCurrentOrder] = React.useState(null);
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
              address {
                line1
                line2
                PC
                city
              }
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
      if (orders.length > 0) {
        const currOrder = orders.filter(
          order =>
            order.status._id === '62b7416df50332eb3572ff15' ||
            order.status._id === '62b74190f50332eb3572ff17'
        );
        if (currOrder && currOrder.length > 0) {
          setCurrentOrder(currOrder[0]);
        } else {
          setCurrentOrder(null);
        }
        setOrders(orders);
      }
    }
  };

  const orderDelivered = async order => {
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
            status: '62b7419ff50332eb3572ff19',
            deliveryUserId: '',
          },
        },
      },
      '',
      'Commande livrée !',
      true
    );
    if (response) {
      socket.emit('orderStatus', {
        to: 'users',
        message: `Commande livrée !`,
      });
      getOrders();
    }
  };

  const orderAccepted = async order => {
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
            status: '62b7416df50332eb3572ff15',
            deliveryUserId: '',
          },
        },
      },
      '',
      'Commande acceptée !',
      true
    );
    if (response) {
      socket.emit('orderStatus', {
        to: 'users',
        message: ``,
      });
      socket.emit('orderStatus', {
        to: 'restaurant',
        message: `Un livreur est en route pour la commande ${order.tag}.`,
      });
      getOrders();
    }
  };

  const orderPickedUp = async order => {
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
            status: '62b74190f50332eb3572ff17',
            deliveryUserId: '',
          },
        },
      },
      '',
      'Commande livrée !',
      true
    );
    if (response) {
      socket.emit('orderStatus', {
        to: 'restaurant',
        message: ``,
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
  }, []);

  return (
    <IonPage className="overflow-y-auto mb-20 flex flex-col justify-center items-center">
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
            {currentOrder !== null && (
              <div className="justify-center align-center items-center flex flex-col flex-auto mt-10">
                {currentOrder.status._id === '62b7416df50332eb3572ff15' ? (
                  <>
                    <div>
                      <div className="mb-5">
                        <HeadingLevel>
                          <Heading styleLevel={1}>Allez chercher le plat au restaurant !</Heading>
                        </HeadingLevel>
                        <p className="mt-2">
                          <div>Adresse complète:</div>
                          <b>
                            {currentOrder.restaurant.name}, {currentOrder.restaurant.address.line1},{' '}
                            {currentOrder.restaurant.address.line2},{' '}
                            {currentOrder.restaurant.address.PC}{' '}
                            {currentOrder.restaurant.address.city}
                          </b>
                        </p>
                        <p className="mt-2">
                          Temps de trajet estimé à vélo: <b>7 minutes</b>
                        </p>
                      </div>
                      <Map
                        initialViewState={{
                          longitude: 1.5128937,
                          latitude: 43.5410339,
                          zoom: 17,
                        }}
                        style={{ width: '100%', height: '400px' }}
                        mapStyle="mapbox://styles/mapbox/streets-v9"
                        mapboxAccessToken={MAPBOX_TOKEN}
                      >
                        <Marker
                          longitude={1.5128937}
                          latitude={43.5410339}
                          style={{ width: '40px' }}
                        >
                          <img src="/img/marker.png" />
                        </Marker>
                      </Map>
                      <div className="justify-center align-center items-center flex-col flex flex-auto mt-5">
                        <HeadingLevel>
                          <Heading styleLevel={6}>
                            Numéro de commande à communiquer:
                          </Heading>
                          <Heading styleLevel={2}>{currentOrder.tag}</Heading>
                        </HeadingLevel>
                      </div>
                    </div>
                    <Button
                      className="flex-1 m-2 mt-10"
                      overrides={{
                        BaseButton: {
                          style: () => ({
                            width: '100%',
                          }),
                        },
                      }}
                      size={SIZE.compact}
                      kind={KIND.primary}
                      onClick={() => orderPickedUp(currentOrder)}
                    >
                      J'ai récupéré le plat
                    </Button>
                  </>
                ) : (
                  <>
                   <div>
                    <div>
                      <div className="mb-5">
                        <HeadingLevel>
                          <Heading styleLevel={1}>Allez livrer le plat au client</Heading>
                        </HeadingLevel>
                        <p className="mt-2">
                          <div>Adresse complète:</div>
                          <b>
                            {currentOrder.restaurant.name}, {currentOrder.restaurant.address.line1},{' '}
                            {currentOrder.restaurant.address.line2},{' '}
                            {currentOrder.restaurant.address.PC}{' '}
                            {currentOrder.restaurant.address.city}
                          </b>
                        </p>
                        <p className="mt-2">
                          Temps de trajet estimé à vélo: <b>7 minutes</b>
                        </p>
                      </div>
                      <Map
                        initialViewState={{
                          longitude: 1.5028242,
                          latitude: 43.5483358,
                          zoom: 17,
                        }}
                        style={{ width: '100%', height: '400px' }}
                        mapStyle="mapbox://styles/mapbox/streets-v9"
                        mapboxAccessToken={MAPBOX_TOKEN}
                      >
                        <Marker
                          longitude={1.5028242}
                          latitude={43.5483358}
                          style={{ width: '40px' }}
                        >
                          <img src="/img/marker.png" />
                        </Marker>
                      </Map>
                      <div className="justify-center align-center items-center flex-col flex flex-auto mt-5">
                        <HeadingLevel>
                          <Heading styleLevel={6}>
                            Nom du client
                          </Heading>
                          <Heading styleLevel={2}>Michel Dupuis</Heading>
                        </HeadingLevel>
                      </div>
                    </div></div>
                    <Button
                      className="flex-1 m-2 mt-10"
                      overrides={{
                        BaseButton: {
                          style: () => ({
                            width: '100%',
                          }),
                        },
                      }}
                      size={SIZE.compact}
                      kind={KIND.primary}
                      onClick={() => orderDelivered(currentOrder)}
                    >
                      J'ai livré le plat
                    </Button>
                  </>
                )}
              </div>
            )}
            {!currentOrder &&
            orders.filter(o => o.status._id === '62b74119f50332eb3572ff11').length > 0 ? (
              <>
                <div className="justify-center align-center items-center flex flex-auto mt-10">
                  <HeadingLevel>
                    <Heading styleLevel={6}>Commandes en attente</Heading>
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
                                onClick={() => orderAccepted(order)}
                              >
                                Accepter
                              </Button>
                            </div>
                          </div>
                        </StyledBody>
                      </Card>
                    </>
                  ))}
              </>
            ) : (
              <>
                {!currentOrder && (
                  <div className="justify-center align-center items-center flex flex-auto mt-10">
                    Aucune commande en attente.
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </IonPage>
  );
};

export default Order;
