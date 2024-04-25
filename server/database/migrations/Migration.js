const produitListe = require("../factories/Produit.factorie.js").produitListe;
const produitEmplacementListe =
  require("../factories/Produit.factorie.js").produitEmplacementListe;
const Entreprise = require("../models/Entreprise.model.js");
const db = require("../../config/Database.js");
const MIGRATE = require("../../utils/utils.js").MIGRATE;
const Association = require("sequelize").Association;
const DataTypes = require("sequelize").DataTypes;
const Caisse = require("../models/Caisse.model.js");
const Fabricant = require("../models/Fabricant.model.js");
const Forme = require("../models/Forme.model.js");
const Unite = require("../models/Unite.model.js");
const Voie = require("../models/Voie.model.js");
const Utilisateur = require("../models/Utilisateur.model.js");
const Produit_emplacement = require("../models/Produit_emplacement.model.js");
const Ravitaillement_detail = require("../models/Ravitaillement_detail.model.js");
const Vente_detail = require("../models/Vente_detail.model.js");
const Ajustement_detail = require("../models/Ajustement_detail.model.js");
const Ajustement = require("../models/Ajustement.model.js");
const Ordonnance = require("../models/Ordonnance.model.js");
const Guichet = require("../models/Guichet.model.js");
const Societe = require("../models/Societe.model.js");
const Client = require("../models/Client.model.js");
const Fournisseur = require("../models/Fournisseur.model.js");
const Mode_expedition = require("../models/Mode_expedition.model.js");
const Emplacement = require("../models/Emplacement.model.js");
const Vente = require("../models/Vente.model.js");
const Famille = require("../models/Famille.model.js");
const Notification = require("../models/Notification.model.js");
const Produit = require("../models/Produit.model.js");
const Ravitaillement = require("../models/Ravitaillement.model.js");
const Notification_utilisateur = require("../models/Notification_utilisateur.model.js");
const Marge_beneficiaire = require("../models/Marge_beneficiaire.model.js");
const caisseListe = require("../seeders/Caisse.seeder.js");
const fabricantListe = require("../seeders/Fabricant.seeder.js");
const familleListe = require("../seeders/Famille.seeder.js");
const formeListe = require("../seeders/Forme.seeder.js");
const uniteListe = require("../seeders/Unite.seeder.js");
const mode_expeditionListe = require("../seeders/Mode_expedition.seeder.js");
const voieListe = require("../seeders/Voie.seeder.js");
const utilisateurListe = require("../factories/Utilisateur.factorie.js");
const fournisseurListe = require("../factories/Fournisseur.factorie.js");
const emplacementListe = require("../seeders/Emplacement.seeder.js");
const utilisateurData = require("../seeders/Utilisateur.seeder.js");
const guichetListe = require("../seeders/Guichet.seeder.js");
const entrepriveData = require("../seeders/Entreprise.seeder.js");
const Marge_beneficiaireListe = require("../seeders/Marge_beneficiaire.seeder.js");
const {
  notificationListe,
  notificationUilisateurListe,
} = require("../factories/Notification.factorie.js");
const { createProduitHook } = require("./Triggers.js");
createProduitHook();
// Association
Ajustement.hasMany(Ajustement_detail, {
  foreignKey: {
    name: "ajustement_id",
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
Ajustement_detail.belongsTo(Ajustement, {
  foreignKey: {
    name: "ajustement_id",
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Produit.hasMany(Ajustement_detail, {
  foreignKey: {
    name: "produit_code_lot_produit",
    type: DataTypes.CHAR(255),
    allowNull: false,
  },
});
Ajustement_detail.belongsTo(Produit, {
  foreignKey: {
    name: "produit_code_lot_produit",
    type: DataTypes.CHAR(255),
    allowNull: false,
  },
});

Utilisateur.hasMany(Ajustement, {
  foreignKey: {
    name: "utilisateur_id",
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
Ajustement.belongsTo(Utilisateur, {
  foreignKey: {
    name: "utilisateur_id",
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
Notification.hasMany(Notification_utilisateur, {
  foreignKey: {
    name: "notification_id",
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
Notification_utilisateur.belongsTo(Notification, {
  foreignKey: {
    name: "notification_id",
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Utilisateur.hasMany(Notification_utilisateur, {
  foreignKey: {
    name: "utilisateur_id",
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
Notification_utilisateur.belongsTo(Utilisateur, {
  foreignKey: {
    name: "utilisateur_id",
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Caisse.hasMany(Ravitaillement, {
  foreignKey: {
    name: "caisse_id",
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});
Ravitaillement.belongsTo(Caisse, {
  foreignKey: {
    name: "caisse_id",
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

Caisse.hasMany(Vente, {
  foreignKey: {
    name: "caisse_id",
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});
Vente.belongsTo(Caisse, {
  foreignKey: {
    name: "caisse_id",
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

Client.hasOne(Vente, {
  foreignKey: {
    name: "client_id",
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
Vente.belongsTo(Client, {
  foreignKey: {
    name: "client_id",
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Societe.hasMany(Vente, {
  foreignKey: {
    name: "societe_id",
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});
Vente.belongsTo(Societe, {
  foreignKey: {
    name: "societe_id",
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

Societe.hasMany(Client, {
  foreignKey: {
    name: "societe_id",
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});
Societe.belongsTo(Client, {
  foreignKey: {
    name: "societe_id",
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

Emplacement.hasMany(Ajustement, {
  foreignKey: {
    name: "emplacement_id",
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
Ajustement.belongsTo(Emplacement, {
  foreignKey: {
    name: "emplacement_id",
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Emplacement.hasMany(Produit_emplacement, {
  foreignKey: {
    name: "emplacement_id",
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
Produit_emplacement.belongsTo(Emplacement, {
  foreignKey: {
    name: "emplacement_id",
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Produit.hasMany(Produit_emplacement, {
  foreignKey: {
    name: "produit_code_lot_produit",
    type: DataTypes.CHAR(255),
    allowNull: false,
  },
});
Produit_emplacement.belongsTo(Produit, {
  foreignKey: {
    name: "produit_code_lot_produit",
    type: DataTypes.CHAR(255),
    allowNull: false,
  },
});

Fabricant.hasMany(Produit, {
  foreignKey: {
    name: "fabricant_id",
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
Produit.belongsTo(Fabricant, {
  foreignKey: {
    name: "fabricant_id",
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Forme.hasMany(Produit, {
  foreignKey: {
    name: "forme_id",
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
Produit.belongsTo(Forme, {
  foreignKey: {
    name: "forme_id",
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Famille.hasMany(Produit, {
  foreignKey: {
    name: "famille_id",
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
Produit.belongsTo(Famille, {
  foreignKey: {
    name: "famille_id",
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Fournisseur.hasMany(Ravitaillement, {
  foreignKey: {
    name: "fournisseur_id",
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
Ravitaillement.belongsTo(Fournisseur, {
  foreignKey: {
    name: "fournisseur_id",
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Mode_expedition.hasMany(Ravitaillement, {
  foreignKey: {
    name: "mode_expedition_id",
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
Ravitaillement.belongsTo(Mode_expedition, {
  foreignKey: {
    name: "mode_expedition_id",
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Guichet.hasOne(Vente, {
  foreignKey: {
    name: "guichet_id",
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});
Vente.belongsTo(Guichet, {
  foreignKey: {
    name: "guichet_id",
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

Ordonnance.hasOne(Vente, {
  foreignKey: {
    name: "ordonnance_id",
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});
Vente.belongsTo(Ordonnance, {
  foreignKey: {
    name: "ordonnance_id",
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

Produit.hasMany(Ravitaillement_detail, {
  foreignKey: {
    name: "produit_code_lot_produit",
    type: DataTypes.CHAR(255),
    allowNull: false,
  },
});
Ravitaillement_detail.belongsTo(Produit, {
  foreignKey: {
    name: "produit_code_lot_produit",
    type: DataTypes.CHAR(255),
    allowNull: false,
  },
});

Ravitaillement.hasMany(Ravitaillement_detail, {
  foreignKey: {
    name: "ravitaillement_id",
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
Ravitaillement_detail.belongsTo(Ravitaillement, {
  foreignKey: {
    name: "ravitaillement_id",
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Unite.hasMany(Ravitaillement_detail, {
  foreignKey: {
    name: "unite_achat",
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
Ravitaillement_detail.belongsTo(Unite, {
  foreignKey: {
    name: "unite_achat",
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Unite.hasMany(Produit, {
  foreignKey: {
    name: "unite_presentation",
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
Produit.belongsTo(Unite, {
  foreignKey: {
    name: "unite_presentation",
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Unite.hasMany(Produit, {
  foreignKey: {
    name: "unite_achat",
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
Produit.belongsTo(Unite, {
  foreignKey: {
    name: "unite_achat",
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Unite.hasMany(Produit, {
  foreignKey: {
    name: "unite_vente",
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
Produit.belongsTo(Unite, {
  foreignKey: {
    name: "unite_vente",
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Unite.hasMany(Produit, {
  foreignKey: {
    name: "unite_stock",
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
Produit.belongsTo(Unite, {
  foreignKey: {
    name: "unite_stock",
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Unite.hasMany(Vente_detail, {
  foreignKey: {
    name: "unite_vente",
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
Vente_detail.belongsTo(Unite, {
  foreignKey: {
    name: "unite_vente",
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
/* 
Produit.belongsToMany(Vente, {
  through: Vente_detail,
  unique: false,
  foreignKey: "produit_code_lot_produit",
});
Vente.belongsToMany(Produit, {
  through: Vente_detail,
  unique: false,
  foreignKey: "vente_id",
}); */
Produit.hasMany(Vente_detail, {
  foreignKey: {
    name: "produit_code_lot_produit",
    type: DataTypes.CHAR(255),
    allowNull: false,
  },
});
Vente_detail.belongsTo(Produit, {
  foreignKey: {
    name: "produit_code_lot_produit",
    type: DataTypes.CHAR(255),
    allowNull: false,
  },
});
Vente.hasMany(Vente_detail, {
  foreignKey: { name: "vente_id", type: DataTypes.CHAR(25), allowNull: false },
});
Vente_detail.belongsTo(Vente, {
  foreignKey: { name: "vente_id", type: DataTypes.CHAR(25), allowNull: false },
});

Voie.hasMany(Produit, {
  foreignKey: { name: "voie_id", type: DataTypes.INTEGER, allowNull: true },
});
Produit.belongsTo(Voie, {
  foreignKey: { name: "voie_id", type: DataTypes.INTEGER, allowNull: true },
});

Utilisateur.hasMany(Vente, {
  foreignKey: {
    name: "guichetier_id",
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
Vente.belongsTo(Utilisateur, {
  foreignKey: {
    name: "guichetier_id",
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
Utilisateur.hasMany(Vente, {
  foreignKey: {
    name: "caissier_id",
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});
Vente.belongsTo(Utilisateur, {
  foreignKey: {
    name: "caissier_id",
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

Utilisateur.hasMany(Ravitaillement, {
  foreignKey: {
    name: "utilisateur_id",
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
Ravitaillement.belongsTo(Utilisateur, {
  foreignKey: {
    name: "utilisateur_id",
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

const Migration = async () => {
  console.log(" \n\n\n\n Migration \n\n\n ");
  await db
    .sync({ force: MIGRATE })
    .then(async () => {
      if (MIGRATE) {
        await Caisse.bulkCreate(caisseListe)
          .then(() => console.log(" ------> Table << caisse >> migrée!"))
          .catch(() => {
            console.log(" ------> Table << caisse >> NON migrée!!!");
          });
        await Fabricant.bulkCreate(fabricantListe)
          .then(() => console.log(" ------> Table << Fabricant >> migrée!"))
          .catch(() =>
            console.log(" ------> Table << Fabricant >> NON migrée!!!")
          );
        await Forme.bulkCreate(formeListe)
          .then(() => console.log(" ------> Table << Forme >> migrée!"))
          .catch(() => console.log(" ------> Table << Forme >> NON migrée!!!"));
        await Famille.bulkCreate(familleListe)
          .then(() => console.log(" ------> Table << Famille >> migrée!"))
          .catch(() =>
            console.log(" ------> Table << Famille >> NON migrée!!!")
          );
        await Voie.bulkCreate(voieListe)
          .then(() => console.log(" ------> Table << Voie >> migrée!"))
          .catch(() => console.log(" ------> Table << Voie >> NON migrée!!!"));
        await Utilisateur.bulkCreate(utilisateurData)
          .then(() => console.log(" ------> Table << Utilisateur >> migrée!"))
          .catch(() =>
            console.log(" ------> Table << Utilisateur >> NON migrée!!!")
          );
        await Utilisateur.bulkCreate(utilisateurListe)
          .then(() => console.log(" ------> Table << Utilisateur >> migrée!"))
          .catch(() =>
            console.log(" ------> Table << Utilisateur >> NON migrée!!!")
          );
        await Fournisseur.bulkCreate(fournisseurListe)
          .then(() => console.log(" ------> Table << Fournisseur >> migrée!"))
          .catch(() =>
            console.log(" ------> Table << Fournisseur >> NON migrée!!!")
          );
        await Mode_expedition.bulkCreate(mode_expeditionListe)
          .then(() =>
            console.log(" ------> Table << Mode_expedition >> migrée!")
          )
          .catch(() =>
            console.log(" ------> Table << Mode_expedition >> NON migrée!!!")
          );
        await Guichet.bulkCreate(guichetListe)
          .then(() => console.log(" ------> Table << Guichet >> migrée!"))
          .catch(() =>
            console.log(" ------> Table << Guichet >> NON migrée!!!")
          );
        await Unite.bulkCreate(uniteListe)
          .then(() => console.log(" ------> Table << Unite >> migrée!"))
          .catch(() => console.log(" ------> Table << Unite >> NON migrée!!!"));
        await Emplacement.bulkCreate(emplacementListe)
          .then(() => console.log(" ------> Table << Emplacement >> migrée!"))
          .catch(() =>
            console.log(" ------> Table << Emplacement >> NON migrée!!!")
          );
        await Produit.bulkCreate(produitListe)
          .then(() => console.log(" ------> Table << Produit >> migrée!"))
          .catch(() =>
            console.log(" ------> Table << Produit >> NON migrée!!!")
          );
        await Produit_emplacement.bulkCreate(produitEmplacementListe)
          .then(() =>
            console.log(" ------> Table << Produit_emplacement >> migrée!")
          )
          .catch(() =>
            console.log(
              " ------> Table << Produit_emplacement >> NON migrée!!!"
            )
          );
        await Entreprise.bulkCreate(entrepriveData)
          .then(() => console.log(" ------> Table << Entreprise >> migrée!"))
          .catch(() =>
            console.log(" ------> Table << Entreprise >> NON migrée!!!")
          );
        await Marge_beneficiaire.bulkCreate(Marge_beneficiaireListe)
          .then(() =>
            console.log(" ------> Table << Marge_beneficiaire >> migrée!")
          )
          .catch(() =>
            console.log(" ------> Table << Marge_beneficiaire >> NON migrée!!!")
          );
        await Notification.bulkCreate(notificationListe)
          .then(() =>
            console.log(" ------> Table << notificationListe >> migrée!")
          )
          .catch(() =>
            console.log(" ------> Table << notificationListe >> NON migrée!!!")
          );
        await Notification_utilisateur.bulkCreate(notificationUilisateurListe)
          .then(() =>
            console.log(" ------> Table << Notification_utilisateur >> migrée!")
          )
          .catch(() =>
            console.log(
              " ------> Table << Notification_utilisateur >> NON migrée!!!"
            )
          );
      }
    })
    .catch(() => console.log(" \n\n\n\n ERROR \n\n\n "));
};

module.exports = Migration;
