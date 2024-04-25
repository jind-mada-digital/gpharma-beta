let arrayValue = ["Caisse principale", "Caisse sécondaire"];
let caisseListe = [];
for (let index = 0; index < arrayValue.length; index++) {
  caisseListe.push({
    nom_caisse: arrayValue[index],
  });
}

module.exports = caisseListe;
