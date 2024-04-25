const DataTypes = require("sequelize").DataTypes;
const db = require("../../config/Database.js");

const Forme = db.define(
  "forme",
  {
    nom_forme: {
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

module.exports = Forme;
