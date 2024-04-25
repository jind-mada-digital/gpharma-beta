let arrayValue = ["Guichet 001", "Guichet 002"];
let guichetListe = [];
for (let index = 0; index < arrayValue.length; index++) {
  guichetListe.push({
    nom_guichet: arrayValue[index],
  });
}

module.exports = guichetListe;
