let arrayValue = [
  "Orale",
  "Rectale",
  "Vaginale",
  "Sous cutanée",
  "Ophtalmique",
];
let voieListe = [];
for (let index = 0; index < arrayValue.length; index++) {
  voieListe.push({
    nom_voie: arrayValue[index],
  });
}

module.exports = voieListe;
