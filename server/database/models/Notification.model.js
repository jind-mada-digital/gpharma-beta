const DataTypes = require("sequelize").DataTypes;
const db = require("../../config/Database.js");

const Notification = db.define(
  "notification",
  {
    label: {
      type: DataTypes.CHAR,
      allowNull: false,
    },
    details: {
      type: DataTypes.CHAR,
    },
    importance: {
      type: DataTypes.CHAR,
    },
    icon: {
      type: DataTypes.CHAR,
    },
  },
  { paranoid: true, freezeTableName: true }
);

module.exports = Notification;
