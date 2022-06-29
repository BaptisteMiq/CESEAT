import { IonPage } from '@ionic/react';
import { Button } from 'baseui/button';
import { Tag, VARIANT } from 'baseui/tag';
import Image from 'next/image';
import React from 'react';
import api from '../api';

const RestaurantDetails = () => {
  var [getRestaurant, setGetRestaurant] = React.useState(false);
  var [restaurant, setRestaurant] = React.useState({
    address: {},
    products: [],
    menus: [{ products: [] }],
    categories: [{ products: [], menus: [{ products: [] }] }],
  });
  const [cart, setCart] = React.useState({
    userId: localStorage.getItem('UserID'),
    restaurant: { _id: localStorage.getItem('restaurantID') },
    products: [],
    menus: [],
    isOrdered: false,
  });

  var getRestaurantById = async () => {
    var response = await api(
      'post',
      {
        query: `query RestaurantById($id: MongoID!) {
        restaurantById(_id: $id) {
          name
          description
          picture
          createdAt
          ownerId
          phoneNumber
          mail
          type {
            label
            description
            _id
          }
          address {
            line1
            line2
            city
            PC
            country
            userId
            _id
          }
          products {
            name
            description
            price
            picture
            createdAt
            allergenicIngredients
            available
            _id
            restaurant {
              _id
            }
          }
          menus {
            name
            description
            price
            picture
            createdAt
            available
            products {
              name
              description
              price
              picture
              createdAt
              allergenicIngredients
              available
              _id
              restaurant {
                _id
              }
            }
            _id
          }
          categories {
            name
            menus {
              name
              description
              price
              picture
              createdAt
              available
              products {
                name
                description
                price
                picture
                createdAt
                allergenicIngredients
                available
                _id
                restaurant {
                  _id
                }
              }
              _id
            }
            products {
              name
              description
              price
              picture
              createdAt
              allergenicIngredients
              available
              _id
              restaurant {
                _id
              }
            }
            createdAt
            _id
          }
          _id
          
        }
      }`,
        variables: `{
        "id": "${localStorage.getItem('restaurantID')}"
      }`,
      },
      '',
      'Le restaurant a bien été récupéré !',
      false
    );

    if (response.data.restaurantById) {
      setGetRestaurant(true);
      setRestaurant(response.data.restaurantById);
    }
  };

  var getCarts = async () => {
    var response = await api(
      'post',
      {
        query: `query MyCarts($filter: FilterFindManyCartInput) {
          myCarts(filter: $filter) {
            userId
            restaurant {
              _id
            }
            products {
              _id
            }
            menus {
              _id
            }
            isOrdered
            _id
          }
        }`,
        variables: `{
          "filter": {
            "restaurant": "${localStorage.getItem('restaurantID')}",
            "isOrdered": false
          }
        }`,
      },
      '',
      'Panier récupéré !',
      false
    );

    if (response) {
      if (response.data.myCarts.length != 0) {
        setCart(response.data.myCarts[0]);
      }
    }
  };

  var updateItemToCart = async (menuId, productId, add) => {
    if (add) {
      productId ? cart.products.push({ _id: productId }) : cart.products;
      menuId ? cart.menus.push({ _id: menuId }) : cart.menus;
    } else {
      if (productId) {
        var i = cart.products
          .map(product => {
            return product._id;
          })
          .indexOf(productId);
        cart.products.splice(i, 1);
      }

      if (menuId) {
        var i = cart.menus
          .map(menu => {
            return menu._id;
          })
          .indexOf(menuId);
        cart.menus.splice(i, 1);
      }
    }
    if (!cart._id) {
      var response = await api(
        'post',
        {
          query: `mutation CartCreateOne($record: CreateOneCartInput!) {
          myCartCreateOne(record: $record) {
            record {
              userId
              restaurant {
                _id
              }
              products {
                _id
              }
              menus {
                _id
              }
              isOrdered
              _id
            }
          }
        }`,
          variables: `{
          "record": {
            "userId": "${cart.userId}",
            "restaurant": "${cart.restaurant._id}",
            "products": [${
              cart.products
                ? cart.products.map(product => {
                    return '"' + product._id + '"';
                  })
                : []
            }],
            "menus": [${
              cart.menus
                ? cart.menus.map(menu => {
                    return '"' + menu._id + '"';
                  })
                : []
            }],
            "isOrdered": ${cart.isOrdered}
          }
        }`,
        },
        '',
        'Le panier a bien été créé !',
        true
      );

      if (response) {
        setCart(response.data.myCartCreateOne.record);
      }
    } else {
      var response = await api(
        'post',
        {
          query: `mutation MyCartUpdateById($id: MongoID!, $record: UpdateByIdCartInput!) {
            myCartUpdateById(_id: $id, record: $record) {
              record {
                userId
                restaurant {
                  _id
                }
                products {
                  _id
                }
                menus {
                  _id
                }
                isOrdered
                _id
              }
            }
          }`,
          variables: `{
            "record": {
              "userId": "${cart.userId}",
              "restaurant": "${cart.restaurant._id}",
              "products": [${
                cart.products
                  ? cart.products.map(product => {
                      return '"' + product._id + '"';
                    })
                  : []
              }],
              "menus": [${
                cart.menus
                  ? cart.menus.map(menu => {
                      return '"' + menu._id + '"';
                    })
                  : []
              }],
              "isOrdered": ${cart.isOrdered}
            },
            "id": "${cart._id}"
          }`,
        },
        '',
        add ? "L'article a bien été ajouté au panier !" : "L'article a bien été retiré du panier !",
        true
      );

      if (response) {
        setCart(response.data.myCartUpdateById.record);
      }
    }
  };

  const productCard = product => (
    <div className="rounded-md p-3 max-w-md w-80 shadow-lg m-4 bg-gray-50 hover:bg-gray-100">
      <div className="h-32 w-full relative">
        <Image
          className="rounded-md"
          objectFit="cover"
          src={
            product.picture
              ? product.picture
              : 'https://static.actu.fr/uploads/2020/04/mcdonalds-deconfinement-ouverture-fast-food-coronavirus-960x640.jpg'
          }
          alt=""
          layout="fill"
        />
      </div>
      <div>
        <h4 className="font-bold py-0 text-s text-black-400 dark:text-black-500 uppercase">
          {product.name}
        </h4>
        <h6 className="dark:text-black-100">{product.description}</h6>
        <h6 className="dark:text-black-100">Prix: {product.price} €</h6>
        <h6 className="dark:text-black-100">
          Nombre dans le panier:{' '}
          {cart.products.length > 0
            ? cart.products.filter(productCart => {
                return productCart._id === product._id;
              }).length
            : 0}
        </h6>
        <div className="flex justify-center m-1">
          {cart.products.filter(productCart => {
            return productCart._id === product._id;
          }).length > 0 ? (
            <div className="m-2">
              <Button
                kind="secondary"
                onClick={() => updateItemToCart(null, product._id, false)}
                size={'compact'}
              >
                Retirer du panier
              </Button>
            </div>
          ) : null}
          <div className="m-2">
            <Button
              kind="primary"
              size={'compact'}
              onClick={() => updateItemToCart(null, product._id, true)}
            >
              Ajouter au panier
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const menuCard = menu => (
    <div className="rounded-md p-3 max-w-md w-80 shadow-lg m-4 bg-gray-50 hover:bg-gray-100">
      <div className="h-32 w-full relative">
        <Image
          className="rounded-md"
          objectFit="cover"
          src={
            menu.picture
              ? menu.picture
              : 'https://static.actu.fr/uploads/2020/04/mcdonalds-deconfinement-ouverture-fast-food-coronavirus-960x640.jpg'
          }
          alt=""
          layout="fill"
        />
      </div>
      <div>
        <h4 className="font-bold py-0 text-s text-black-400 dark:text-black-500 uppercase">
          {menu.name}
        </h4>
        <h6 className="dark:text-black-100">{menu.description}</h6>
        <h6 className="dark:text-black-100">Prix: {menu.price} €</h6>
        <h6 className="dark:text-black-100">
          Nombre dans le panier:{' '}
          {
            cart.menus.filter(menuCart => {
              return menuCart._id === menu._id;
            }).length
          }
        </h6>
        <h6 className="dark:text-black-100">Produit: </h6>
        {menu.products.map(product => (
          <Tag closeable={false} kind="primary" variant={VARIANT.solid}>
            {product.name}
          </Tag>
        ))}
        <div className="flex flex-row">
          {cart.menus.filter(menuCart => {
            return menuCart._id === menu._id;
          }).length > 0 ? (
            <div className="m-2">
              <Button
                kind="secondary"
                onClick={() => updateItemToCart(menu._id, null, false)}
                size={'compact'}
              >
                Retirer du panier
              </Button>
            </div>
          ) : null}
          <div className="m-2">
            <Button
              kind="primary"
              size={'compact'}
              onClick={() => updateItemToCart(menu._id, null, true)}
            >
              Ajouter au panier
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  React.useEffect(() => {
    getRestaurantById();
    getCarts();
  }, [getRestaurant]);

  return (
    <IonPage className="top-14 flex flex-col overflow-scroll">
      <div className="h-auto w-auto relative m-2" style={{ minHeight: '200px' }}>
        <Image
          className="rounded-md"
          objectFit="cover"
          src={
            'https://static.actu.fr/uploads/2020/04/mcdonalds-deconfinement-ouverture-fast-food-coronavirus-960x640.jpg'
          }
          alt=""
          layout="fill"
        />
      </div>
      <div className="m-2">
        <h3 className="font-bold text-6xl m-1">{restaurant.name}</h3>
        <h6 className="text-3xl m-1">{restaurant.description}</h6>
        <p className="text-xl text-gray-500 m-1">
          {restaurant.address.line1 +
            ', ' +
            restaurant.address.line2 +
            ', ' +
            restaurant.address.city +
            ', ' +
            restaurant.address.PC}
        </p>
      </div>
      {restaurant.categories.length == 0 &&
      restaurant.menus.length == 0 &&
      restaurant.products.length == 0 ? (
        <div className="font-bold text-3xl text-center h-full mt-32">
          Aucun produit n'est disponible dans ce restaurant !
        </div>
      ) : null}
      {restaurant.categories.length > 0 ? (
        <div className="categories m-2 rounded-md p-3 shadow-lg m-4 bg-gray-100">
          {restaurant.categories.map(category => (
              (category.menus.length > 0 || category.products.length > 0) ? ( 
                <div>
                  <h3 className="font-bold text-3xl m-2">{category.name}</h3>
                  {category.menus ? (
                    <div className="flex flex-row flex-wrap">
                      <h3 className="font-bold text-2xl m-4 w-full">Menu</h3>
                      {category.menus.map(menu => menuCard(menu))}
                    </div>
                    ) : null}
                  { category.products.length > 0 ? (
                    <div className="flex flex-row flex-wrap">
                      <h3 className="font-bold text-2xl m-4 w-full">Produit</h3>
                      {category.products.map(product => productCard(product))}
                    </div>
                 ) : null}
                </div>
               ) : null
          ))}
        </div>
      ) : null}
      {restaurant.menus.length > 0 ? (
        <div className="menus m-2 rounded-md p-3 shadow-lg m-4 bg-gray-100 flex flex-row flex-wrap">
          <h3 className="font-bold text-3xl m-2 w-full">Menus</h3>
          {restaurant.menus.map(menu => menuCard(menu))}
        </div>
      ) : null}
      {restaurant.products.length > 0 ? (
        <div className="menus m-2 rounded-md p-3 shadow-lg m-4 bg-gray-100 flex flex-row flex-wrap">
          <h3 className="font-bold text-3xl m-2 w-full">Produits</h3>
          {restaurant.products.map(product => productCard(product))}
        </div>
      ) : null}
    </IonPage>
  );
};

export default RestaurantDetails;
