const DataTypes = require("sequelize").DataTypes;
const db = require("../../config/Database.js");
const Vente_detail = db.define(
  "vente_detail",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    quantite_demande: { type: DataTypes.DOUBLE, allowNull: false },
    quantite_vendue: { type: DataTypes.DOUBLE, allowNull: true },
    prix_vente: { type: DataTypes.DOUBLE, allowNull: false },
    montant_vente: { type: DataTypes.DOUBLE, allowNull: false },
    status: { type: DataTypes.BOOLEAN, defaultValue: "1" },
  },
  { paranoid: true, freezeTableName: true }
);
//   unite_vente: { type: DataTypes.INTEGER(10), allowNull: false },
module.exports = Vente_detail;
