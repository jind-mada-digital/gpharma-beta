const faker = require("@faker-js/faker").faker;
const bcryptData = require("../../utils/utils.js").bcryptData;
let utilisateurListe = [];
for (let index = 0; index < 6; index++) {
  utilisateurListe.push({
    nom_utilisateur: faker.name.fullName(),
    nom_login: faker.name.firstName(),
    type_utilisateur: "ADMIN",
    contact: faker.phone.number(),
    sexe: "HOMME",
    email: faker.internet.email(),
    mot_de_passe: bcryptData("password"),
    date_der_log: faker.date.recent(),
  });
}

module.exports = utilisateurListe;
