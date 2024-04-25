const options = {
  format: "A5",
  orientation: "portrait",
  border: "5mm",
  // padding: "5mm",
  header: {
    height: "8mm",
    contents:
      '<div style="text-align: right; font-family: Arial, sans-serif;font-size: 8px">Auteur: Gpharma@2.0.0 / MADA-Digital / www.mada-digital.net</div>',
  },
  footer: {
    height: "10mm",
    contents: {
      first: " ",
      2: " ", // Any page number is working. 1-based index
      default: " ", // fallback value
      last: " ",
    },
  },
};

module.exports = options;
