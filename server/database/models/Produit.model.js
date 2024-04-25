const DataTypes = require("sequelize").DataTypes;
const db = require("../../config/Database.js");

const Produit = db.define(
  "produit",
  {
    code_lot_produit: {
      type: DataTypes.CHAR(255),
      primaryKey: true,
      allowNull: false,
    },
    nom_produit: {
      type: DataTypes.CHAR(255),
      allowNull: false,
    },
    classification_produit: {
      type: DataTypes.TEXT,
    },
    description: {
      type: DataTypes.TEXT,
    },
    image: {
      type: DataTypes.CHAR(255),
    },
    presentation_quantite: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    quantite_stock: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    prix_stock: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    stock_min: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    stock_max: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    date_der_ravitaillement: {
      type: DataTypes.DATE,
      // allowNull: false,
    },
    date_peremption: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: "1",
    },
  },
  {
    paranoid: true,
    freezeTableName: true,
  }
);

module.exports = Produit;
