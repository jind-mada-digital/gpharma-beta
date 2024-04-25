const DataTypes = require("sequelize").DataTypes;
const db = require("../../config/Database.js");
const Marge_beneficiaire = db.define(
  "marge_beneficiaire",
  {
    marge_beneficiaire: {
      type: DataTypes.CHAR(255),
      allowNull: false,
      unique: true,
    },
    active: { type: DataTypes.INTEGER, defaultValue: "1" },
    status: { type: DataTypes.INTEGER, defaultValue: "1" },
  },
  { paranoid: true, freezeTableName: true }
);
module.exports = Marge_beneficiaire;
