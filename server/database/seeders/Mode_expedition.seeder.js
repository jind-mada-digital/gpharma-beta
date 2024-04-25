let arrayValue = ["Voie aérienne", "Voie maritine", "Voie terrestre"];
let mode_expeditionListe = [];
for (let index = 0; index < arrayValue.length; index++) {
  mode_expeditionListe.push({
    nom_mode_expedition: arrayValue[index],
  });
}

module.exports = mode_expeditionListe;
