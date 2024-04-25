let arrayValue = ["Dépôt principale", "Etalé"];
let emplacementListe = [];
for (let index = 0; index < arrayValue.length; index++) {
  emplacementListe.push({
    nom_emplacement: arrayValue[index],
  });
}

module.exports = emplacementListe;
