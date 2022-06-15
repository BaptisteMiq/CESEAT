export const images = [
  'https://static.actu.fr/uploads/2020/04/mcdonalds-deconfinement-ouverture-fast-food-coronavirus-960x640.jpg',
  'https://images.lanouvellerepublique.fr/image/upload/60fa128f37dcf51d408b48a6.jpg',
  'https://i2.wp.com/www.tommys-cafe.com/wp-content/uploads/2017/03/header_news-caen.jpg?fit=2000%2C1037&ssl=1',
  'https://www.lebarasushi.com/images/lebarasushi/facadeIzumi0417.jpg',
  'https://www.lamontagne.fr/photoSRC/Gw--/tour-de-ville_4162444.jpeg'
];

export const homeItems = [
  {
    Restaurant: 'McDonald',
    Adresse: 'Labège',
    image: images[0],
  },
  {
    Restaurant: 'Burger King',
    Adresse: 'Labège',
    image: images[1],
  },
  {
    Restaurant: 'Tommys Cafe',
    Adresse: 'Labège',
    image: images[2],
  },
  {
    Restaurant: 'Sushi IZUMI',
    Adresse: 'Labège',
    image: images[3],
  },
  {
    Restaurant: 'Del Arte',
    Adresse: 'Labège',
    image: images[4],
  },
];

export const notifications = [
  { title: 'New friend request', when: '6 hr' },
  { title: 'Please change your password', when: '1 day' },
  { title: 'You have a new message', when: '2 weeks' },
  { title: 'Welcome to the app!', when: '1 month' },
];

// Some fake lists
export const lists = [
  {
    name: 'Groceries',
    id: 'groceries',
    items: [{ name: 'Apples' }, { name: 'Bananas' }, { name: 'Milk' }, { name: 'Ice Cream' }],
  },
  {
    name: 'Hardware Store',
    id: 'hardware',
    items: [
      { name: 'Circular Saw' },
      { name: 'Tack Cloth' },
      { name: 'Drywall' },
      { name: 'Router' },
    ],
  },
  { name: 'Work', id: 'work', items: [{ name: 'TPS Report' }, { name: 'Set up email' }] },
  { name: 'Reminders', id: 'reminders' },
];
