import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar
} from '@ionic/react';
import Image from 'next/image';
import Store from '../../store';
import { getHomeItems } from '../../store/selectors';
import Card from '../ui/Card';
import React from 'react';
import api from '../api';
import { restaurant } from 'ionicons/icons';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { Input } from 'baseui/input';
import { defaultImage } from '../ui/Images';

const HomeCard = ({ name, address, picture }) => (
  <div className='HomeCard rounded-md p-3 max-w-md w-80 shadow-lg m-4 bg-gray-50 hover:bg-gray-100 cursor-pointer'>
    <div className="h-32 w-full relative">
      <Image className="rounded-md" objectFit="cover" src={process.env.NEXT_PUBLIC_CDN + (picture ?? defaultImage)} alt="" layout='fill' />
    </div>
    <div>
      <h4 className="font-bold py-0 text-s text-black-400 dark:text-black-500 uppercase">{name} - {address.city}</h4>
      <h6 className="dark:text-black-100">Frais de livraison : 1€</h6>
    </div>
  </div>
  );

const Home = () => {
  var [getRestaurants, setGetRestaurants] = React.useState(false);
  var [ listOfRestaurant, setListOfRestaurant] = React.useState([]);
  var [searchValue, setSearchValue] = React.useState("");
  var history = useHistory();
  var getListOfRestaurant = async () => {
    var response = await await api('post', {
      query: `query Restaurants {
        restaurants {
          name
          description
          picture
          type {
            label
            _id
          }
          address {
            line1
            line2
            city
            PC
            country
            _id
          }
          _id
        }
      }`
    }, '', 'La liste des restaurants a bien été récupérée !', false);

    if(response.data.restaurants) {
      setGetRestaurants(true);
      setListOfRestaurant(response.data.restaurants);
      console.log(response.data.restaurants);
    }
  }

  var restaurantDetails = (restaurant) => {
    localStorage.setItem("restaurantID", restaurant._id);
    history.push('/users/restaurant/details');
  }

  React.useEffect(() => {
    getListOfRestaurant();
  }, [getRestaurants]);

  return (
    <IonPage className='top-14 mb-20 bg-white flex justify-center flex-wrap flex-row overflow-y-scroll' style={{contain: 'None'}}>
        <div className='justify-center w-full m-5'>
          <Input
            value={searchValue}
            onChange={e => setSearchValue(e.target.value) }
            placeholder="Rechercher un restaurant"
            clearOnEscape
          />
        </div>
        {listOfRestaurant.length > 0 ? listOfRestaurant.filter(restaurant => { return restaurant.name.toLowerCase().includes(searchValue.toLowerCase())}).map((i, index) => (
          <a onClick={() => restaurantDetails(i)}>
            <HomeCard {...i} key={index}/>
          </a>
        )): <p><br></br>Aucun restaurant disponible pour le moment !</p>}
    </IonPage>
  );
};

export default Home;
