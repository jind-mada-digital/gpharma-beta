const DataTypes = require("sequelize").DataTypes;
const db = require("../../config/Database.js");
const Entreprise = db.define(
  "entreprise",
  {
    id: {
      type: DataTypes.CHAR(255),
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    nom_entreprise: {
      type: DataTypes.CHAR(255),
      allowNull: false,
      unique: true,
    },
    logo: { type: DataTypes.CHAR(255), allowNull: false },
    adresse: { type: DataTypes.CHAR(255), allowNull: false },
    contact: { type: DataTypes.CHAR(100), allowNull: false },
    nif: { type: DataTypes.CHAR(255), allowNull: false },
    stat: { type: DataTypes.CHAR(255), allowNull: false },
    website: { type: DataTypes.CHAR(255), allowNull: true },
    email: { type: DataTypes.CHAR(255), allowNull: true },
  },
  { paranoid: true, freezeTableName: true }
);
module.exports = Entreprise;
