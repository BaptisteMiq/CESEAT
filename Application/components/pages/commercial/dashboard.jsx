import {
IonContent, IonItem, IonLabel, IonList, IonPage, IonToggle
} from '@ionic/react';
import { Table, TableBuilder, TableBuilderColumn } from "baseui/table-semantic";
import {useStyletron} from 'baseui';
import {Button, KIND, SIZE} from 'baseui/button';
import api from '../../api';
import React from 'react';

  const Dashboard = () => {
  
    var [orders, setOrders] = React.useState([]);
    var [getOrders, setGetOrders] = React.useState(false);
    var listOfOrders = [];
    var getAllOrders = async () => {

        var response = await api('post', {
            query: `query Orders {
                orders {
                  userId
                  restaurant {
                    name
                  }
                  deliveryUserId
                  cart {
                    _id
                  }
                  tag
                  status {
                    label
                  }
                  _id
                }
              }`
        }, '', 'Liste des commandes bien récupérée !', false);

        if(response) {
            if(response.data.orders) {
                response.data.orders.map(async order => {

                    if(order.deliveryUserId) {
                        var responseDelivery = await api('post', {
                            query: `query UserById($id: String) {
                                userById(ID: $id) {
                                  Lastname
                                  Firstname
                                  Mail
                                }
                              }`,
                              variables: `
                              {
                                  "id": "${order.deliveryUserId}"
                              }
                              `
                        }, '', 'Information du livreur bien récupérée !', false);
                    }

                    var responseUsers = await api('post', {
                        query: `query UserById($id: String) {
                            userById(ID: $id) {
                              Lastname
                              Firstname
                              Mail
                            }
                          }`,
                          variables: `
                          {
                              "id": "${order.userId}"
                          }
                          `
                    }, '', 'Information du livreur bien récupérée !', false);

                    var deleveryInfo = "";
                    if(responseDelivery) {
                        if(responseDelivery.data.userById) {
                            deleveryInfo = responseDelivery.data.userById.Mail;
                        }
                    }

                    var userInfo = "";
                    if(responseUsers) {
                        if(responseUsers.data.userById) {
                            userInfo = responseUsers.data.userById.Mail;
                        }
                    }
                    console.log(order);
                    listOfOrders.push({"Tag": order.tag, "Client": userInfo, "Restaurant": order.restaurant ? order.restaurant.name : "", "Delivery": deleveryInfo, "Status": order.status.label, "Price": "0", "Button": ["Supprimer"]});
                  });
                if(!getOrders) {
                  setOrders(listOfOrders);
                }
                setGetOrders(true);
            }
        }
    }

    React.useEffect(async () => {
        await getAllOrders();
    }, [getOrders])

    function ButtonsCell({labels}) {
        const [css, theme] = useStyletron();
        return (
          <div className={css({display: 'flex', alignItems: 'center'})}>
            {labels.map((label, index) => {
              return (
                <Button
                  kind={KIND.secondary}
                  size={SIZE.compact}
                  colors={"red"}
                  overrides={{
                    BaseButton: {
                      style: {
                        marginLeft: index > 0 ? theme.sizing.scale300 : 0,
                        backgroundColor: "red",
                        color: "white"
                      },
                    },
                  }}
                  key={label}
                >
                  {label}
                </Button>
              );
            })}
          </div>
        );
      }
    return (
      <IonPage className='top-20 mb-20 overflow-y-scroll'>
          <div className='flex flex-row justify-center'>
            {
              getOrders ? (
                <TableBuilder
                  className="w-full m-2"
                  data={orders}
                  >
                  <TableBuilderColumn header="N° de commande">
                      {row => row.Tag}
                  </TableBuilderColumn>
                  <TableBuilderColumn header="Client">
                      {row => row.Client}
                  </TableBuilderColumn>
                  <TableBuilderColumn header="Restaurateur">
                      {row => row.Restaurant}
                  </TableBuilderColumn>
                  <TableBuilderColumn header="Livreur">
                      {row => row.Delivery}
                  </TableBuilderColumn>
                  <TableBuilderColumn header="Status">
                      {row => row.Status}
                  </TableBuilderColumn>
                  <TableBuilderColumn header="Prix">
                      {row => row.Price}
                  </TableBuilderColumn>
                  <TableBuilderColumn header="">
                      {row => <ButtonsCell labels={row.Button} />}
                  </TableBuilderColumn>
              </TableBuilder>
              ) : null
            }
        </div>
      </IonPage>
    );
  };
  
  export default Dashboard;
  