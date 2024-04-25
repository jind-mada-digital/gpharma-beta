let arrayValue = [
  "AEROSOL",
  "AIGUILLE",
  "ALESE",
  "AMPOULE",
  "APPAREIL",
  "ASPIRATEUR",
  "ATELE",
  "BANDE",
  "BANDELETTE",
  "CAPSULE",
  "CLAMP",
  "COLLYRE",
  "COMPRESSE",
  "COTON",
  "CPR",
  "CPR A SUCER",
  "CPR DISPERS",
  "CPR EFFER",
  "CPR SEC",
  "CREME",
  "DRAGEE",
  "EAU OXYGENE",
  "EMULSION",
  "FIL NON RESORB",
  "FIL RESOR",
  "FLACON",
  "FLOCON",
  "GANT",
  "GARROT",
  "GEL",
  "GELULE",
  "GOUTTE BUV",
  "GRANULE",
  "KIT",
  "LAME",
  "LAMELLE",
  "LANCETTE",
  "LANGUETTE",
  "LIQUIDE",
  "MASQUE",
  "OUTIL",
  "OVULE",
  "P P S",
  "PAPIER",
  "PATE GINGIVALE",
  "PLAQUETTE",
  "POCHE",
  "POCHE PLASTIQUE",
  "POMMADE",
  "POUDRE",
  "PRODUIT",
  "RACCORD",
  "RECIPIENT",
  "SACHET",
  "SERINGUE",
  "SILICONE",
  "SIROP",
  "SOL ANTISEP",
  "SOL GINGIVALE",
  "SOL NASAL",
  "SOL P INHAL",
  "SOL RECT",
  "SOL/BUV",
  "SOL/INJ",
  "SOLUTION",
  "SONDE",
  "SPARADRAP",
  "SUPPO",
  "SUSP BUV",
  "TISSU PERFORE",
  "TRANSFUSEUR",
  "TULLE",
  "TUYAU",
];
let formeListe = [];
for (let index = 0; index < arrayValue.length; index++) {
  formeListe.push({
    nom_forme: arrayValue[index],
  });
}

module.exports = formeListe;
