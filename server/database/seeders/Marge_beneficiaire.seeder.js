let arrayValue = ["1.38", "1.30", "1.25", "1.45"];
let Marge_beneficiaireListe = [];
for (let index = 0; index < arrayValue.length; index++) {
  Marge_beneficiaireListe.push({
    marge_beneficiaire: arrayValue[index],
    active: index == 0 ? "1" : "0",
  });
}

module.exports = Marge_beneficiaireListe;
