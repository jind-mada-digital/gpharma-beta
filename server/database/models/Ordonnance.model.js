const DataTypes = require("sequelize").DataTypes;
const db = require("../../config/Database.js");

const Ordonnance = db.define(
  "ordonnance",
  {
    nom_docteur: {
      type: DataTypes.CHAR(255),
      allowNull: false,
      // unique: true,
    },
    hopital: {
      type: DataTypes.CHAR(255),
      allowNull: false,
    },
  },
  { paranoid: true, freezeTableName: true }
);

module.exports = Ordonnance;
