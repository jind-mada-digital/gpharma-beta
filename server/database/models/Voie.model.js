const DataTypes = require("sequelize").DataTypes;
const db = require("../../config/Database.js");

const Voie = db.define(
  "voie",
  {
    nom_voie: {
      type: DataTypes.CHAR(255),
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: "1",
    },
  },
  { paranoid: true, freezeTableName: true }
);

module.exports = Voie;
