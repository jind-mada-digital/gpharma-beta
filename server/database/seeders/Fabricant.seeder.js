let arrayValue = [
  "BMS",
  "JANSSEN",
  "MEDREICH",
  "DENK PHARMA - SA",
  "ABBOT",
  "LEO",
  "AJANTA",
  "MICRO LABS",
  "GSK",
  "CIRON",
  "CLARIS",
  "NOVARTIS",
  "ETHICON",
  "SHANGHAI",
  "LAVOISIER",
  "ACINO",
  "SANOFI",
  "ZENTIVA",
  "MEDA",
  "PFIZER",
  "M-GENERIC",
  "CIPLA",
  "UPSA",
  "SANOAV",
  "IPRAM",
  "COOPER",
  "IMRES",
  "BAYCH",
  "ASTRA ZENECA",
  "NCPC",
  "DESKA",
  "V-MEDICAL",
];
let fabricantListe = [];
for (let index = 0; index < arrayValue.length; index++) {
  fabricantListe.push({
    nom_fabricant: arrayValue[index],
  });
}

module.exports = fabricantListe;
