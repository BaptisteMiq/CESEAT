import {
  IonContent, IonHeader, IonItem,
  IonLabel, IonPage, IonTitle, IonToolbar
} from '@ionic/react';
import Store from '../../store';
import * as selectors from '../../store/selectors';

const ListEntry = ({ list, ...props }) => (
  <IonItem routerLink={`/users/browse/${list.id}`} className="list-entry">
    <IonLabel>{list.name}</IonLabel>
  </IonItem>
);

const AllLists = ({ onSelect }) => {
  const lists = Store.useState(selectors.getLists);

  return (
    <>
      {lists.map((list, i) => (
        <ListEntry list={list} key={i} />
      ))}
    </>
  );
};

const Lists = () => {
  return (
    <IonPage>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Lists</IonTitle>
          </IonToolbar>
        </IonHeader>
        <AllLists />
      </IonContent>
    </IonPage>
  );
};

export default Lists;
