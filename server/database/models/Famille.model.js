const DataTypes = require("sequelize").DataTypes;
const db = require("../../config/Database.js");

const Famille = db.define(
  "famille",
  {
    nom_famille: { type: DataTypes.CHAR(255), allowNull: false, unique: true },
    status: { type: DataTypes.BOOLEAN, defaultValue: "1" },
  },
  { paranoid: true, freezeTableName: true }
);
module.exports = Famille;
