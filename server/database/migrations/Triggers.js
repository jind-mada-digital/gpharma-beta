const {
  createNewNotification,
} = require("../../controllers/Notification.controller");
const Produit = require("../models/Produit.model");

const createProduitHook = () => {
  /* Produit.addHook("isExpired", (instance, options) => {
    if (instance.date_peremption < new Date()) {
      const label = `${nom_produit} (#${code_produit}) est périmé !`;
      const details = `Le produit ${nom_produit} (#${code_produit}) est périmé !`;
      createNewNotification({
        label,
        details,
        importance: `danger`,
        icon: `trash-alt`,
      });
    }
  }); */
};
module.exports = {
  createProduitHook,
};
