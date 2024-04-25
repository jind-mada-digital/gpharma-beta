const DataTypes = require("sequelize").DataTypes;
const db = require("../../config/Database.js");

const Ravitaillement_detail = db.define(
  "ravitaillement_detail",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    prix_unit: { type: DataTypes.DOUBLE, allowNull: false },
    montant_ht: { type: DataTypes.DOUBLE, allowNull: false },
    quantite_demande: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    quantite_livraison: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    status: { type: DataTypes.BOOLEAN, defaultValue: "1" },
  },
  {
    paranoid: true,
    timestamps: false,
    freezeTableName: true,
  }
);
module.exports = Ravitaillement_detail;
