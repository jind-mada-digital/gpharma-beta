const bcryptData = require("../../utils/utils.js").bcryptData;
let utilisateurData = [];
utilisateurData.push({
  id: 0,
  nom_utilisateur: "JOSOA Yassini Jacquerel",
  nom_login: "YASS",
  type_utilisateur: "ADMIN",
  contact: "0325526802",
  sexe: "HOMME",
  email: "jooyassini@gmail.com",
  mot_de_passe: bcryptData(" "),
});

module.exports = utilisateurData;
