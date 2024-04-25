const DataTypes = require("sequelize").DataTypes;
const db = require("../../config/Database.js");

const Caisse = db.define(
  "caisse",
  {
    nom_caisse: {
      type: DataTypes.CHAR,
      unique: true,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: "1",
    },
  },
  { paranoid: true, freezeTableName: true }
);

module.exports = Caisse;
