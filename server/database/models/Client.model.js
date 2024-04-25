const DataTypes = require("sequelize").DataTypes;
const db = require("../../config/Database.js");

const Client = db.define(
  "client",
  {
    nom_prenom: { type: DataTypes.CHAR(255), allowNull: false },
    adresse: { type: DataTypes.CHAR(255), allowNull: false },
    status: { type: DataTypes.BOOLEAN, defaultValue: "1" },
  },
  { paranoid: true, freezeTableName: true }
);
module.exports = Client;
