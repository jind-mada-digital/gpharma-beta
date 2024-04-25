const faker = require("@faker-js/faker").faker;
let notificationListe = [];
let notificationUilisateurListe = [];
const getNumberRadom = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
const getNotifDetails = (random) => {
  let notif = {
    name: "",
    importance: "",
    icon: "",
  };
  switch (random) {
    case 0:
      notif = {
        name: "Vente reussi",
        importance: "success",
        icon: "",
      };
      break;
    case 1:
      notif = {
        name: "Produit bientôt périmé",
        importance: "warning",
        icon: "",
      };
      break;
    case 2:
      notif = {
        name: "Nouveau produit périmé",
        importance: "danger",
        icon: "",
      };
      break;
    case 3:
      notif = {
        name: "Nouveau vente non validé",
        importance: "secondary",
        icon: "",
      };
      break;
    case 4:
      notif = {
        name: "Nouvelle statistique journalière",
        importance: "info",
        icon: "",
      };
      break;
    default:
      notif = {
        name: "Notification " + random,
        importance: "info",
        icon: "",
      };
  }

  return { ...notif, details: faker.lorem.lines(random) };
};
const getEtatNotif = () => {
  const random = getNumberRadom(0, 5);
  let etat = "NOUVELLE";
  switch (random) {
    case 0:
      etat = "VUE";
      break;
    case 1:
      etat = "SUPPRIME";
      break;
    case random > 1:
      etat = "NOUVELLE";
      break;
  }
  return etat;
};
for (let index = 0; index < 20; index++) {
  const notif = getNotifDetails(getNumberRadom(0, 4));
  notificationListe.push({
    label: notif.name,
    details: notif.details,
    importance: notif.importance,
    icon: notif.icon,
  });
  notificationUilisateurListe.push({
    etat: getEtatNotif(),
    notification_id: index + 1,
    utilisateur_id: getNumberRadom(1, 6),
  });
}

module.exports = { notificationListe, notificationUilisateurListe };
