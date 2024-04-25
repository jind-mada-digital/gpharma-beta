const DataTypes = require("sequelize").DataTypes;
const db = require("../../config/Database.js");

const Produit_emplacement = db.define(
  "produit_emplacement",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    quantite_produit: { type: DataTypes.DOUBLE, allowNull: false },
    quantite_der_depot: { type: DataTypes.DOUBLE, allowNull: false },
    quantite_der_retrait: { type: DataTypes.DOUBLE, allowNull: true },
    date_der_depot: { type: DataTypes.DATE, allowNull: false },
    date_der_retrait: { type: DataTypes.DATE, allowNull: true },
    status: { type: DataTypes.BOOLEAN, defaultValue: "1" },
  },

  { paranoid: true, timestamps: false, freezeTableName: true }
);

module.exports = Produit_emplacement;
