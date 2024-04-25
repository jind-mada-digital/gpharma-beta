const faker = require("@faker-js/faker").faker;
let fournisseurListe = [];
const getNumberRadom = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
for (let index = 0; index < 6; index++) {
  fournisseurListe.push({
    nom_fournisseur: faker.name.fullName(),
    contact_fournisseur: faker.phone.number(),
    contact_secretaire: faker.phone.number(),
    compte_PCG: "TEST",
    condition_paiement: "FACKERS",
    delais_reglement: getNumberRadom(1, 14),
    email: faker.internet.email(),
    adresse: faker.address.city(),
    nif: faker.internet.password(),
    stat: faker.internet.password(),
    sigle: faker.name.firstName(),
  });
}

module.exports = fournisseurListe;
