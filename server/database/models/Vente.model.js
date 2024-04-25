const DataTypes = require("sequelize").DataTypes;
const db = require("../../config/Database.js");

const Vente = db.define(
  "vente",
  {
    id: {
      type: DataTypes.CHAR(25),
      primaryKey: true,
      allowNull: false,
    },
    motif: { type: DataTypes.TEXT },
    file_societe: { type: DataTypes.CHAR(255) },
    montant_total: { type: DataTypes.DOUBLE, allowNull: false },
    date_saisi: { type: DataTypes.DATE, allowNull: false },
    date_vente: { type: DataTypes.DATE, allowNull: true },
    societe_prise_en_charge: { type: DataTypes.DOUBLE, allowNull: true },
    etat_vente: { type: DataTypes.BOOLEAN, defaultValue: "1" },
  },
  { paranoid: true, freezeTableName: true }
);
module.exports = Vente;
