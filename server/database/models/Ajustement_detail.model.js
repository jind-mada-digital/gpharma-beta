const DataTypes = require("sequelize").DataTypes;
const db = require("../../config/Database.js");

const Ajustement_detail = db.define(
  "ajustement_detail",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    quantite_nouveau_stock: { type: DataTypes.DOUBLE, allowNull: false },
    quantite_nouveau_presentation: { type: DataTypes.DOUBLE, allowNull: false },
    quantite_ancien_stock: { type: DataTypes.DOUBLE, allowNull: false },
    quantite_ancien_presentation: { type: DataTypes.DOUBLE, allowNull: false },
    unite_nouveau_stock: { type: DataTypes.INTEGER, allowNull: false },
    unite_nouveau_presentation: { type: DataTypes.INTEGER, allowNull: false },
    unite_ancien_stock: { type: DataTypes.INTEGER, allowNull: false },
    unite_ancien_presentation: { type: DataTypes.INTEGER, allowNull: false },
  },
  { paranoid: true, timestamps: false, freezeTableName: true }
);
module.exports = Ajustement_detail;
