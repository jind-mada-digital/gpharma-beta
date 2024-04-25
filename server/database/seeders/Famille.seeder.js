let arrayValue = [
  "CONSOMMABLE",
  "MEDICAMENT",
  "INJECTION",
  "MATÉRIAUX",
  "INSTRUMENT",
  "OUTILS",
];
let familleListe = [];
for (let index = 0; index < arrayValue.length; index++) {
  familleListe.push({
    nom_famille: arrayValue[index],
  });
}

module.exports = familleListe;
