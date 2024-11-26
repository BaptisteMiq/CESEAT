import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar
} from '@ionic/react';
import Image from 'next/image';
import Store from '../../store';
import { getHomeItems } from '../../store/selectors';
import Card from '../ui/Card';


const HomeCard = ({ title, type, text, author, authorAvatar, image }) => (
  <Card className="my-4 mx-auto">
    <div className="h-32 w-full relative">
      <Image className="rounded-t-xl" objectFit="cover" src={image} alt="" layout='fill' />
    </div>
    <div className="px-4 py-4 bg-white rounded-b-xl dark:bg-gray-800">
      <h4 className="font-bold py-0 text-s text-gray-400 dark:text-gray-500 uppercase">{type}</h4>
      <h2 className="font-bold text-2xl text-gray-800 dark:text-gray-100">{title}</h2>
      <p className="sm:text-sm text-s text-gray-500 mr-1 my-3 dark:text-gray-400">{text}</p>
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 relative">
          <Image layout='fill' src={authorAvatar} className="rounded-full" alt="" />
        </div>
        <h3 className="text-gray-500 dark:text-gray-200 m-l-8 text-sm font-medium">{author}</h3>
      </div>
    </div>
  </Card>
);

const HomeCardTest = ({ Restaurant, Adresse, image }) => (
<div className='HomeCard rounded-md p-3 max-w-md w-80 shadow-lg m-4 bg-gray-50 hover:bg-gray-100'>
    <div className="h-32 w-full relative">
      <Image className="rounded-md" objectFit="cover" src={image} alt="" layout='fill' />
    </div>
    <div>
      <h4 className="font-bold py-0 text-s text-black-400 dark:text-black-500 uppercase">{Restaurant} - {Adresse}</h4>
      <h6 className="dark:text-black-100">Frais de livraison : 1€</h6>
    </div>
  </div>

  );

const Home = () => {
  const homeItems = Store.useState(getHomeItems);
  return (
    <IonPage className='flex justify-center flex-wrap flex-row static overflow-visible' style={{contain: 'None'}}>
        {homeItems.map((i, index) => (
          <HomeCardTest {...i} key={index} />
        ))}
    </IonPage>
  );
};

export default Home;
