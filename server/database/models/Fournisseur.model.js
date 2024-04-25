const DataTypes = require("sequelize").DataTypes;
const db = require("../../config/Database.js");

const Fournisseur = db.define(
  "fournisseur",
  {
    nom_fournisseur: {
      type: DataTypes.CHAR(255),
      allowNull: false,
      unique: true,
    },
    contact_fournisseur: {
      type: DataTypes.CHAR(100),
      unique: true,
    },
    contact_secretaire: {
      type: DataTypes.CHAR(100),
      allowNull: false,
      unique: true,
    },
    compte_PCG: {
      type: DataTypes.CHAR(255),
    },
    logo: {
      type: DataTypes.CHAR(100),
    },
    // image: {
    //   type: DataTypes.CHAR(255),
    // },
    condition_paiement: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    delais_reglement: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    email: {
      type: DataTypes.CHAR(255),
      allowNull: false,
      unique: true,
    },
    adresse: {
      type: DataTypes.CHAR(255),
      allowNull: false,
    },
    nif: {
      type: DataTypes.CHAR(255),
      allowNull: false,
      unique: true,
    },
    stat: {
      type: DataTypes.CHAR(255),
      allowNull: false,
      unique: true,
    },
    sigle: {
      type: DataTypes.CHAR(100),
      unique: true,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: "1",
    },
  },
  {
    paranoid: true,
    freezeTableName: true,
  }
);

module.exports = Fournisseur;
