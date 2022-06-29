export function newNotification(message) {
  if (!message) return;

  // Vérifions si le navigateur prend en charge les notifications
  if (!('Notification' in window)) {
    alert(message);
  }

  // Vérifions si les autorisations de notification ont déjà été accordées
  else if (Notification.permission === 'granted') {
    // Si tout va bien, créons une notification
    const notification = new Notification(message);
  }

  // Sinon, nous devons demander la permission à l'utilisateur
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      // Si l'utilisateur accepte, créons une notification
      if (permission === 'granted') {
        const notification = new Notification(message);
      }
    });
  }

  // Enfin, si l'utilisateur a refusé les notifications, et que vous
  // voulez être respectueux, il n'est plus nécessaire de les déranger.
}
