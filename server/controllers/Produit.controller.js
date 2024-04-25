const QueryTypes = require("sequelize").QueryTypes;
const db = require("../config/Database.js");
const Fabricant = require("../database/models/Fabricant.model.js");
const Famille = require("../database/models/Famille.model.js");
const Forme = require("../database/models/Forme.model.js");
const Produit = require("../database/models/Produit.model.js");
const Produit_emplacement = require("../database/models/Produit_emplacement.model.js");
const Unite = require("../database/models/Unite.model.js");
const Voie = require("../database/models/Voie.model.js");
const {
  convertEngDayMonth,
} = require("../utils/nizwami-ibrahim/ConvertEngDayMonth.js");
const getDateNow = require("../utils/utils.js").getDateNow;
const getEmplacement = require("../utils/utils.js").getEmplacement;
const uploadFile = require("../utils/utils.js").uploadFile;

const queryGet =
  'SELECT `produit`.`code_lot_produit`,  `produit`.`nom_produit`, DATE_FORMAT(`produit`.`date_peremption`, "%Y-%m-%d") AS date_peremption,  GROUP_CONCAT(\'{ "emplacement_id" : "\',PE.emplacement_id,\'", "nom_emplacement" : "\',E.nom_emplacement, \'" , "quantite_produit" : "\', PE.quantite_produit, \'" }--//--\') AS emplacement, `produit`.`prix_stock`, `produit`.`quantite_stock`,  `produit`.`classification_produit`,  `produit`.`description`,  `produit`.`image`,  `produit`.`presentation_quantite`,  `produit`.`stock_min`,  `produit`.`stock_max`, DATE_FORMAT(`produit`.date_der_ravitaillement, "%Y-%m-%d %hh%i") AS date_der_ravitaillement,  `produit`.`status`,  `produit`.`createdAt`,  `produit`.`updatedAt`,  `produit`.`deletedAt`,  `produit`.`fabricant_id`,  `produit`.`forme_id`,  `produit`.`famille_id`,  `produit`.`unite_presentation`,  `produit`.`unite_achat`,  `produit`.`unite_vente`,  `produit`.`unite_stock`,  `produit`.`voie_id`, `fabricant`.`nom_fabricant` AS `nom_fabricant`, `famille`.`nom_famille` AS `nom_famille`,  `forme`.`nom_forme` AS `nom_forme`, P.`nom_unite` AS `nom_presentation`, A.`nom_unite` AS `nom_achat`,   S.`nom_unite` AS `nom_stock`,  V.`nom_unite` AS `nom_vente`, `voie`.`nom_voie` AS `nom_voie` FROM `produit` LEFT JOIN `famille` ON `produit`.`famille_id` = `famille`.`id` LEFT JOIN `fabricant` ON `produit`.`fabricant_id` = `fabricant`.`id` LEFT JOIN `forme` ON `produit`.`forme_id` = `forme`.`id` LEFT JOIN `unite` P ON `produit`.`unite_presentation` = P.`id` LEFT JOIN `unite` A ON `produit`.`unite_achat` = A.`id` LEFT JOIN `unite` V ON `produit`.`unite_vente` = V.`id` LEFT JOIN `unite` S ON `produit`.`unite_stock` = S.`id` LEFT JOIN `voie` ON `produit`.`voie_id` = `voie`.`id` LEFT JOIN `Produit_emplacement` PE ON `produit`.`code_lot_produit` = PE.`produit_code_lot_produit` LEFT JOIN `emplacement` E ON PE.`emplacement_id` = E.`id` WHERE  `produit`.`deletedAt` IS NULL AND `famille`.`deletedAt` IS NULL AND `fabricant`.`deletedAt` IS NULL AND `forme`.`deletedAt` IS NULL AND P.`deletedAt` IS NULL AND A.`deletedAt` IS NULL AND V.`deletedAt` IS NULL AND S.`deletedAt` IS NULL '; // AND produit.`status` = "1"
const queryGroupBy =
  " GROUP BY `produit`.`code_lot_produit` ORDER BY `produit`.`nom_produit` ASC";

const getAll = async (req, res) => {
  try {
    const response = await db.query(queryGet + queryGroupBy, {
      type: QueryTypes.SELECT,
    });
    res.json(response);
  } catch (error) {
    //console.log(error.message);
  }
};

const getAllEtalage = async (req, res) => {
  try {
    const response = await db.query(
      queryGet +
        '  AND PE.quantite_produit != "0"  AND PE.emplacement_id = "2" AND  DATE(NOW()) >= DATE(produit.date_peremption)  ' +
        queryGroupBy,
      {
        type: QueryTypes.SELECT,
      }
    );
    res.json(response);
  } catch (error) {
    //console.log(error.message);
  }
};

const getSelectEtalage = async (req, res) => {
  try {
    const response = await db.query(
      queryGet +
        '  AND PE.quantite_produit != "0"  AND PE.emplacement_id = "1" AND produit.status = "1" AND  DATE(NOW()) >= DATE(produit.date_peremption)  ' +
        queryGroupBy,
      {
        type: QueryTypes.SELECT,
      }
    );
    res.json(response);
  } catch (error) {
    //console.log(error.message);
  }
};

const getSpecific = async (req, res) => {
  try {
    const response = await db.query(
      queryGet +
        ' AND `produit`.code_lot_produit = "' +
        req.params.code_lot_produit +
        '" ' +
        queryGroupBy,
      { type: QueryTypes.SELECT }
    );
    // if (response.length > 0) {
    //   const _response = {
    //     ...response[0].dataValues,
    //     ["date_der_ravitaillement"]: convertEngDayMonth(
    //       response[0].dataValues.date_der_ravitaillement
    //     ),
    //   };
    //   console.log("\n\n_response\n\n", _response);
    // }
    return res.json(response);
  } catch (error) {
    //console.log(error.message);
  }
};

const createOne = async (req, res) => {
  const transaction = await db.transaction();
  let item = JSON.parse(req.body.data);
  const insertDB = async () => {
    try {
      await Produit.create(item, { transaction });
      await Produit_emplacement.create(
        {
          quantite_produit: item.quantite_stock,
          quantite_der_depot: item.quantite_stock,
          quantite_der_retrait: null,
          date_der_depot: getDateNow(),
          date_der_retrait: null,
          emplacement_id: 1,
          produit_code_lot_produit: item.code_lot_produit,
        },
        { transaction }
      );
      await transaction.commit();
      return res
        .status(200)
        .json({ message: item.nom_produit + " ajouté avec succès!" });
    } catch (error) {
      //console.log("error", error.message);
      await transaction.rollback();
      return res.status(404).json({ message: error.message });
    }
  };
  if (!req.files) {
    insertDB();
  } else {
    delete item["image"];
    uploadFile(
      req,
      res,
      "PRODUIT_",
      "images/produit",
      item,
      insertDB,
      "",
      "image"
    );
  }
};

const updateOne = async (req, res) => {
  let data = JSON.parse(req.body.data);
  //console.log("\n\nitem produit", data, "\n\n");
  const item = await Produit.findOne({
    where: { code_lot_produit: req.params.code_lot_produit },
  });
  if (!item) return res.status(404).json({ message: "Produit introvable!" });
  //console.log("\n\nitem produit", item, "\n\n");
  if (!req.files) {
    data.image = item.image;
  } else {
    uploadFile(
      req,
      res,
      "PRODUIT_",
      "images/produit",
      data,
      null,
      item.image,
      "image"
    );
  }
  try {
    item.set(data);
    await item.save();
    return res
      .status(200)
      .json({ message: data.nom_produit + " modifié(e) avec succès!" });
  } catch (error) {
    //console.log("error", error.message);
    return res.status(404).json({ message: error.message });
  }
};

const deleteOne = async (req, res) => {
  const item = await Produit.findOne({
    where: { code_lot_produit: req.params.code_lot_produit },
  });
  if (!item) return res.status(404).json({ message: "Produit introvable!" });
  try {
    await Produit_emplacement.destroy({
      where: { produit_code_lot_produit: req.params.code_lot_produit },
    });
    await item.destroy();
    return res.status(200).json({ message: "Produit supprimé avec succès!" });
  } catch (error) {
    //console.log(error);
  }
};

const updateStatus = async (req, res) => {
  let item = await db.query(
    queryGet +
      ' AND `produit`.code_lot_produit = "' +
      req.params.code_lot_produit +
      '" ' +
      queryGroupBy,
    { type: QueryTypes.SELECT }
  );
  if (!item) return res.status(404).json({ message: "Produit introvable!" });
  item = item[0];
  //console.log("\n\n\n\n\nreq.body", req.body);
  if (getEmplacement(item.emplacement)[1])
    if (getEmplacement(item.emplacement)[1].quantite_produit > 0) {
      return res.status(404).json({
        message: "Ce produit existe encore dans l'étalage!",
      });
    }
  try {
    const itemProduit = await Produit.findOne({
      where: { code_lot_produit: req.params.code_lot_produit },
    });
    itemProduit.set(req.body);
    itemProduit.save();
    return res.status(200).json({
      message:
        item.nom_produit +
        (req.body.status == "1" ? " activé" : " désactivé") +
        " avec succès!",
    });
  } catch (error) {
    //console.log(error.message);
  }
};

const updateEtalage = async (req, res) => {
  const transaction = await db.transaction();
  const item_produit = await Produit.findOne({
    where: { code_lot_produit: req.params.code_lot_produit },
  });
  if (!item_produit)
    return res.status(404).json({ message: "Produit introvable!" });

  const item_produit_emplacement_PRINCIPALE = await Produit_emplacement.findOne(
    {
      where: {
        produit_code_lot_produit: req.params.code_lot_produit,
        emplacement_id: 1,
      },
    }
  );
  if (!item_produit)
    return res.status(404).json({ message: "Produit introvable!" });
  if (!item_produit_emplacement_PRINCIPALE)
    return res
      .status(404)
      .json({ message: "Produit_emplacement_PRINCIPALE introvable!" });

  let item_produit_emplacement_ETALE = await Produit_emplacement.findOne({
    where: {
      produit_code_lot_produit: req.params.code_lot_produit,
      emplacement_id: 2,
    },
  });
  try {
    let message = "";
    let last_quantite_PRINCIPALE =
      item_produit_emplacement_PRINCIPALE.quantite_produit;
    let last_quantite_ETALE = 0.0;
    let new_qte_PRINCIPALE = 0.0;
    let new_qte_ETALE = 0.0;
    if (
      parseFloat(item_produit_emplacement_PRINCIPALE.quantite_produit) <
      parseFloat(req.body.qte)
    ) {
      return res.status(404).json({
        message: `**${item_produit.nom_produit}**: quantité en stock (principale) est INFERIEUR **${last_quantite_PRINCIPALE}** à celle que vous avez entrée **${req.body.qte}** `,
      });
    }
    //Si de Produit_emplacement ETALE de cette produit n'est pas encore créée
    if (!item_produit_emplacement_ETALE) {
      //CREATION de la table Produit_emplacement ETALE
      item_produit_emplacement_ETALE = await Produit_emplacement.create(
        {
          quantite_produit: req.body.qte,
          quantite_der_depot: req.body.qte,
          quantite_der_retrait: null,
          date_der_depot: getDateNow(),
          date_der_retrait: null,
          emplacement_id: 2,
          produit_code_lot_produit: req.params.code_lot_produit,
        },
        { transaction }
      );
      //MISE A JOUR de la table Produit_emplacement PRINCIPALE
      message += `**${item_produit.nom_produit}**: quantité étalé était de **${last_quantite_ETALE}** à **${item_produit_emplacement_ETALE.quantite_produit}**\n`;
    }
    //Si de Produit_emplacement de cette produit est déjà créée
    else {
      last_quantite_ETALE = item_produit_emplacement_ETALE.quantite_produit;
      //Mise à jours de la table Produit_emplacement 2
      new_qte_ETALE =
        parseFloat(last_quantite_ETALE) + parseFloat(req.body.qte);
      item_produit_emplacement_ETALE.set({
        quantite_produit: new_qte_ETALE,
        quantite_der_depot: req.body.qte,
        date_der_depot: getDateNow(),
      });
      await item_produit_emplacement_ETALE.save({ transaction });

      message = `**${item_produit.nom_produit}**: quantité étalé était de **${last_quantite_ETALE}** à **${item_produit_emplacement_ETALE.quantite_produit}**\n`;
    }
    //Mise à jours item_produit_emplacement_PRINCIPALE
    new_qte_PRINCIPALE =
      parseFloat(item_produit_emplacement_PRINCIPALE.quantite_produit) -
      parseFloat(req.body.qte);
    item_produit_emplacement_PRINCIPALE.set({
      quantite_produit: new_qte_PRINCIPALE,
    });
    await item_produit_emplacement_PRINCIPALE.save({ transaction });
    // console.log(
    //   "\n\n\n\n\nlast_quantite_ETALE",
    //   last_quantite_ETALE,
    //   "new_qte_ETALE",
    //   new_qte_ETALE,
    //   item_produit_emplacement_ETALE,
    //   item_produit_emplacement_PRINCIPALE,
    //   "\n\n\n\n\n"
    // );
    message += `\n\nQuantité en stock (principale) était de **${last_quantite_PRINCIPALE}** à **${item_produit_emplacement_PRINCIPALE.quantite_produit}**`;

    await transaction.commit();
    return res.status(200).json({
      message,
    });
  } catch (error) {
    await transaction.rollback();
    console.log(error.message);
  }
};

module.exports = {
  getAll,
  getAllEtalage,
  getSelectEtalage,
  getSpecific,
  createOne,
  updateOne,
  deleteOne,
  updateEtalage,
  updateStatus,
};
