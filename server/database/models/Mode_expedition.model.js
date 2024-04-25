const DataTypes = require("sequelize").DataTypes;
const db = require("../../config/Database.js");
const Mode_expedition = db.define(
  "mode_expedition",
  {
    nom_mode_expedition: {
      type: DataTypes.CHAR(255),
      allowNull: false,
      unique: true,
    },
    status: { type: DataTypes.BOOLEAN, defaultValue: "1" },
  },
  { paranoid: true, freezeTableName: true }
);
module.exports = Mode_expedition;
