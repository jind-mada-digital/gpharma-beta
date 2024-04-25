const DataTypes = require("sequelize").DataTypes;
const db = require("../../config/Database.js");

const Ajustement = db.define(
  "ajustement",
  {
    motif: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    date_saisi: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    date_ajustement: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: "1",
    },
  },
  { paranoid: true, freezeTableName: true }
);

module.exports = Ajustement;
