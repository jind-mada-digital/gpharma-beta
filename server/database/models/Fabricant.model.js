const DataTypes = require("sequelize").DataTypes;
const db = require("../../config/Database.js");

const Fabricant = db.define(
  "fabricant",
  {
    nom_fabricant: {
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

module.exports = Fabricant;
