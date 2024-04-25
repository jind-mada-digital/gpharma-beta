const db = require("../config/Database.js");
const Client = require("../database/models/Client.model.js");
const Vente = require("../database/models/Vente.model.js");
const Ordonnance = require("../database/models/Ordonnance.model.js");
const Produit = require("../database/models/Produit.model.js");
const Vente_detail = require("../database/models/Vente_detail.model.js");
const getEmplacement = require("../utils/utils.js").getEmplacement;
const getId = require("../utils/utils.js").getId;
const uploadFile = require("../utils/utils.js").uploadFile;
const QueryTypes = require("sequelize").QueryTypes;
const Utilisateur = require("../database/models/Utilisateur.model.js");
const Unite = require("../database/models/Unite.model.js");
const Guichet = require("../database/models/Guichet.model.js");
const Caisse = require("../database/models/Caisse.model.js");
const Societe = require("../database/models/Societe.model.js");
const Produit_emplacement = require("../database/models/Produit_emplacement.model.js");
const Notification = require("../database/models/Notification.model.js");
const { getDateNow } = require("../utils/utils.js");
const { createNewNotification } = require("./Notification.controller.js");
const convertEngDayMonth =
  require("../utils/nizwami-ibrahim/ConvertEngDayMonth.js").convertEngDayMonth;
const queryGet =
  'SELECT `produit`.`code_lot_produit`,  `produit`.`nom_produit`,  GROUP_CONCAT(\'{ "emplacement_id" : "\',PE.emplacement_id,\'", "nom_emplacement" : "\',E.nom_emplacement, \'" , "quantite_produit" : "\', PE.quantite_produit, \'" }--//--\') AS emplacement, `produit`.`prix_stock`, `produit`.`quantite_stock`,  `produit`.`classification_produit`,  `produit`.`description`,  `produit`.`image`,  `produit`.`presentation_quantite`,  `produit`.`stock_min`,  `produit`.`stock_max`,  `produit`.`date_der_ravitaillement`,  `produit`.`status`,  `produit`.`createdAt`,  `produit`.`updatedAt`,  `produit`.`deletedAt`,  `produit`.`fabricant_id`,  `produit`.`forme_id`,  `produit`.`famille_id`,  `produit`.`unite_presentation`,  `produit`.`unite_achat`,  `produit`.`unite_vente`,  `produit`.`unite_stock`,  `produit`.`voie_id`, `fabricant`.`nom_fabricant` AS `nom_fabricant`, `famille`.`nom_famille` AS `nom_famille`,  `forme`.`nom_forme` AS `nom_forme`, P.`nom_unite` AS `nom_presentation`, A.`nom_unite` AS `nom_achat`,   S.`nom_unite` AS `nom_stock`,  V.`nom_unite` AS `nom_vente`, `voie`.`nom_voie` AS `nom_voie` FROM `produit` LEFT JOIN `famille` ON `produit`.`famille_id` = `famille`.`id` LEFT JOIN `fabricant` ON `produit`.`fabricant_id` = `fabricant`.`id` LEFT JOIN `forme` ON `produit`.`forme_id` = `forme`.`id` LEFT JOIN `unite` P ON `produit`.`unite_presentation` = P.`id` LEFT JOIN `unite` A ON `produit`.`unite_achat` = A.`id` LEFT JOIN `unite` V ON `produit`.`unite_vente` = V.`id` LEFT JOIN `unite` S ON `produit`.`unite_stock` = S.`id` LEFT JOIN `voie` ON `produit`.`voie_id` = `voie`.`id` LEFT JOIN `Produit_emplacement` PE ON `produit`.`code_lot_produit` = PE.`produit_code_lot_produit` LEFT JOIN `emplacement` E ON PE.`emplacement_id` = E.`id` WHERE  `produit`.`deletedAt` IS NULL AND `famille`.`deletedAt` IS NULL AND `fabricant`.`deletedAt` IS NULL AND `forme`.`deletedAt` IS NULL AND P.`deletedAt` IS NULL AND A.`deletedAt` IS NULL AND V.`deletedAt` IS NULL AND S.`deletedAt` IS NULL ';
const queryGroupBy = " GROUP BY `produit`.`code_lot_produit` ";

const getAllGuichet = async (req, res) => {
  try {
    let response = await Vente.findAll({
      attributes: {
        include: [
          [
            db.fn("DATE_FORMAT", db.col("date_saisi"), " %W %d %M %Y à %Hh%i"),
            "date_saisi",
          ],
          [
            db.fn("DATE_FORMAT", db.col("date_vente"), " %W %d %M %Y "),
            "date_vente",
          ],
        ],
      },
      where: { guichetier_id: req.params.utilisateur_id },
      include: [{ model: Client }, { model: Utilisateur }],
    });
    let resp = [];
    if (response.length > 0)
      response.map((element) => {
        element = {
          ...element.dataValues,
          ["date_saisi"]: convertEngDayMonth(element.date_saisi),
          ["date_vente"]: convertEngDayMonth(element.date_vente),
        };
        resp.push(element);
      });
    res.json(resp);
  } catch (error) {
    console.log(error.message);
  }
};
const getAllCaisse = async (req, res) => {
  try {
    let response = await Vente.findAll({
      attributes: {
        include: [
          [
            db.fn("DATE_FORMAT", db.col("date_saisi"), " %W %d %M %Y à %Hh%i"),
            "date_saisi",
          ],
          [
            db.fn("DATE_FORMAT", db.col("date_vente"), " %W %d %M %Y "),
            "date_vente",
          ],
        ],
      },
      where: { caissier_id: req.params.utilisateur_id },
      include: [{ model: Client }, { model: Utilisateur }],
    });
    let resp = [];
    if (response.length > 0) {
      response.map((element) => {
        element = {
          ...element.dataValues,
          ["date_saisi"]: convertEngDayMonth(element.date_saisi),
          ["date_vente"]: convertEngDayMonth(element.date_vente),
          ["_previousDataValues"]: null,
        };
        resp.push(element);
      });
    }
    res.json(resp);
  } catch (error) {
    console.log(error.message);
  }
};
const getGuichetNonLivrer = async (req, res) => {
  try {
    let response = await Vente.findAll({
      attributes: {
        include: [
          [
            db.fn("DATE_FORMAT", db.col("date_saisi"), " %W %d %M %Y à %Hh%i"),
            "date_saisi",
          ],
          [
            db.fn("DATE_FORMAT", db.col("date_vente"), " %W %d %M %Y "),
            "date_vente",
          ],
        ],
      },
      include: { model: Utilisateur },
      where: { etat_vente: "0" },
    });
    let resp = [];
    if (response.length > 0) {
      response.map((element) => {
        element = {
          ...element.dataValues,
          ["date_saisi"]: convertEngDayMonth(element.date_saisi),
          ["date_vente"]: convertEngDayMonth(element.date_vente),
          ["_previousDataValues"]: null,
        };
        resp.push(element);
      });
    }
    res.json(resp);
  } catch (error) {
    console.log(error.message);
  }
};
const getSpecific = async (req, res) => {
  try {
    let response_vente = await Vente.findOne({
      attributes: {
        include: [
          [
            db.fn("DATE_FORMAT", db.col("date_saisi"), " %W %d %M %Y à %Hh%i"),
            "date_saisi",
          ],
          [
            db.fn("DATE_FORMAT", db.col("date_vente"), " %W %d %M %Y "),
            "date_vente",
          ],
        ],
      },
      where: { id: req.params.id },
      include: [
        { model: Client },
        { model: Guichet },
        { model: Ordonnance },
        { model: Caisse },
        { model: Societe },
      ],
    });
    let resp_v = {
      ...response_vente.dataValues,
      ["date_saisi"]: convertEngDayMonth(response_vente.date_saisi),
      ["date_vente"]: convertEngDayMonth(response_vente.date_vente),
    };
    const guichetier = await Utilisateur.findOne({
      where: { id: response_vente.guichetier_id },
    });
    const caissier = await Utilisateur.findOne({
      where: { id: response_vente.caissier_id },
    });
    const _vente = { ...resp_v, caissier, guichetier };
    let response_venteDetails = await Vente_detail.findAll({
      where: { vente_id: req.params.id },
      include: [{ model: Unite }, { model: Produit }],
    });
    res.json([_vente, response_venteDetails]);
  } catch (error) {
    console.log(error.message);
  }
};
const getAllVenteDetails = async (req, res) => {
  try {
    let response = await Vente.findOne({ where: { id: req.params.id } });
    const resp = {};
    resp = {
      ...response,
      ["date_saisi"]: convertEngDayMonth(element.date_saisi),
      ["date_vente"]: convertEngDayMonth(element.date_vente),
    };
    res.json(resp);
  } catch (error) {
    console.log(error.message);
  }
};
const createOne = async (req, res) => {
  const { vente, listVenteDetails, client, ordonnance } = JSON.parse(
    req.body.data
  );
  const utilisateur_id = req.body.utilisateur_id;
  console.log("req.body", req.body);
  const transaction = await db.transaction();
  let motif = vente.motif;
  try {
    let ordonnance_id = null;
    if (ordonnance.hopital) {
      const item_ordonnance = await Ordonnance.create(ordonnance, {
        transaction,
      });
      if (!item_ordonnance)
        return res.status(404).json({ message: "Une erreur est survénue!" });
      ordonnance_id = item_ordonnance.id;
    }
    const item_client = await Client.create(
      {
        nom_prenom: client.nom_prenom ? client.nom_prenom : "Inconnu",
        adresse: client.adresse ? client.adresse : "Inconnu",
      },
      { transaction }
    );
    if (!item_client)
      return res.status(404).json({ message: "Une erreur est survénue!" });

    const id_vente = await getId(Vente, "VENTE_");

    console.log("\n\n Before motif == ", motif);
    motif != "" ? (motif = motif) : (motif = "Motif du vente #" + id_vente);
    console.log("\n\n After motif == ", motif);

    const item_vente = await Vente.create(
      {
        ...vente,
        id: id_vente,
        ["motif"]: motif,
        ordonnance_id,
        client_id: item_client.id,
        guichetier_id: utilisateur_id,
      },
      { transaction }
    );
    if (!item_vente)
      return res.status(404).json({ message: "Une erreur est survénue!" });

    let message = [];
    message.push("Guichet n°" + item_vente.id + " : ");
    let produit_arr = [];
    listVenteDetails.map(async (element, index_element) => {
      const item_produit = await db.query(
        queryGet +
          '  AND PE.quantite_produit != "0"  AND PE.emplacement_id = "2" AND `produit`.code_lot_produit = "' +
          element.produit_code_lot_produit +
          '" AND  DATE(NOW()) >= DATE(produit.date_peremption) ',
        queryGroupBy,
        { type: QueryTypes.SELECT }
      );
      if (!item_produit[0][0]) {
        await transaction.rollback();
        return res.status(404).json({
          message: `${element.nom_produit} introuvable dans l'étalage!`,
        });
      }
      produit_arr.push(item_produit[0][0]);
      await Vente_detail.create(
        {
          quantite_demande: element.quantite_demande,
          quantite_vendue: element.quantite_demande,
          prix_vente: element.prix_vente,
          montant_vente: element.montant_vente,
          produit_code_lot_produit: element.produit_code_lot_produit,
          unite_vente: element.unite_vente,
          vente_id: item_vente.id,
        },
        { transaction }
      )
        .then(async (item_venteDetail) => {
          if (!item_venteDetail) {
            await transaction.rollback();
            return res.status(404).json({
              message:
                "Une erreur est survénue au niveau de la création des ventes détails!",
            });
          }

          const quantite_produit = getEmplacement(
            produit_arr[index_element].emplacement
          )[0].quantite_produit;
          console.log(
            "\nitem_venteDetail // produit_arr[index_element]",
            item_venteDetail,
            produit_arr[index_element],
            "\n\n"
          );
          if (
            item_venteDetail.unite_vente ==
            produit_arr[index_element].unite_stock
          ) {
            console.log("\n 0000", "\n\n");
            if (
              parseFloat(item_venteDetail.quantite_demande) >
              parseFloat(quantite_produit)
            ) {
              console.log(
                "\nitem_venteDetail.quantite_demande > quantite_produit",
                item_venteDetail.quantite_demande,
                quantite_produit,
                "\n\n"
              );
              await transaction.rollback();
              return res.status(404).json({
                message: `Quantité de ${element.nom_produit} insuffisante, quantité actuelle (${quantite_produit} ${produit_arr[index_element].nom_stock})!`,
              });
            }
            message.push(
              ` **${produit_arr[index_element].nom_produit}** (${item_venteDetail.quantite_demande} ${produit_arr[index_element].nom_stock}) `
            );
          } else if (
            item_venteDetail.unite_vente ==
            produit_arr[index_element].unite_presentation
          ) {
            console.log("\n 1111", "\n\n");
            if (
              parseFloat(item_venteDetail.quantite_demande) >
              parseFloat(quantite_produit) *
                parseFloat(produit_arr[index_element].presentation_quantite)
            ) {
              console.log(
                "\nitem_venteDetail.quantite_demande > quantite_produit * produit_arr[index_element].presentation_quantite",
                item_venteDetail.quantite_demande,
                quantite_produit *
                  produit_arr[index_element].presentation_quantite,
                "\n\n"
              );
              await transaction.rollback();
              return res.status(404).json({
                message: `Quantité de ${
                  element.nom_produit
                } insuffisante, quantité actuelle (${
                  quantite_produit *
                  produit_arr[index_element].presentation_quantite
                } ${produit_arr[index_element].nom_presentation})!`,
              });
            }
            message.push(
              ` **${produit_arr[index_element].nom_produit}** (${item_venteDetail.quantite_demande} ${produit_arr[index_element].nom_presentation}) `
            );
          }
          console.log("\n\n message ", index_element, message, "\n\n");
          if (index_element == listVenteDetails.length - 1) {
            console.log("\n\nADD NOTIFICATION\n\n");
            createNewNotification(
              {
                label: `Commande n° ${item_vente.id} * à recevoir!`,
                details: `Commande n° ${item_vente.id} d'un guichetier * à recevoir par un caissier.`,
                importance: `secondary`,
                icon: `shopping-cart`,
              }
              // transaction
            );
            await transaction.commit();
            if (req.files) {
              const dataUpdateFile = { file_societe: "" };
              uploadFile(
                req,
                res,
                "FILE_",
                "pdf/vente/file_societe",
                dataUpdateFile,
                async () => {
                  item_vente.set(dataUpdateFile);
                  await item_vente.save();
                },
                "",
                "file_societe",
                [".pdf", ".png", ".jpeg", ".jpg"]
              );
            }
            console.log(
              "message.length === listVenteDetails.length",
              message.length,
              listVenteDetails.length
            );
            if (message.length === listVenteDetails.length + 1)
              return res.status(200).json({ message: message.join(" \n ") });
          }
        })
        .catch(async (err) => {
          await transaction.rollback();
          return res
            .status(404)
            .json({ message: "Guichet detail non ajouté!" });
        });
    });
  } catch (error) {
    console.log(error);
    await transaction.rollback();
    return res.status(404).json({ message: "Guichet non ajouté!" });
  }
};
const updateOne = async (req, res) => {};
const validateVenteCaisse = async (req, res) => {
  const { vente_id, caisse_id, date_vente, utilisateur_id } = req.body;
  const transaction = await db.transaction();
  const vente = await Vente.findOne({ where: { id: req.params.id } });
  if (!vente)
    return res
      .status(404)
      .json({ message: "Vente #" + req.params.id + " introvable!" });

  // ________________________________________________
  const unites = await Unite.findAll();
  const getNameUniteById = (id) => {
    return unites.find((a) => a.id == id).nom_unite;
  };
  // ________________________________________________
  try {
    const item_vente = await Vente.findOne({ where: { id: vente_id } });
    const listVtDtls = await Vente_detail.findAll({ where: { vente_id } });
    if (!listVtDtls) {
      return res
        .status(404)
        .json({ message: "Les détails de vente est introvable!" });
    }
    let message = ["Vente du guichet n°" + vente.id];
    let produit_arr = [];
    listVtDtls.map(async (item_venteDetail, index) => {
      const item_produit_emplacement = await Produit_emplacement.findOne({
        where: {
          produit_code_lot_produit: item_venteDetail.produit_code_lot_produit,
          emplacement_id: "2",
        },
        include: [{ model: Produit }],
      });
      if (!item_produit_emplacement) {
        await transaction.rollback();
        return res.status(404).json({
          message: `${element.nom_produit} introuvable dans l'étalage!`,
        });
      }
      produit_arr.push(item_produit_emplacement);
      const last_quantite_produit = parseFloat(
        item_produit_emplacement.quantite_produit
      );
      const presentation_quantite = parseFloat(
        item_produit_emplacement.produit.presentation_quantite
      );
      const quantite_vendue = parseFloat(item_venteDetail.quantite_vendue);
      if (
        item_produit_emplacement.produit.unite_stock ==
        item_venteDetail.unite_vente
      ) {
        if (last_quantite_produit < quantite_vendue) {
          await transaction.rollback();
          return res.status(404).json({
            message: `Quantité du ${
              item_produit_emplacement.produit.nom_produit
            } dans l'étalage (${last_quantite_produit} ${getNameUniteById(
              item_produit_emplacement.produit.unite_stock
            )}) est inférieur celle que vous voulez vendre (${quantite_vendue} ${getNameUniteById(
              item_venteDetail.unite_vente
            )})!`,
          });
        }
      } else if (
        item_produit_emplacement.produit.unite_presentation ==
        item_venteDetail.unite_vente
      ) {
        if (last_quantite_produit * presentation_quantite < quantite_vendue) {
          await transaction.rollback();
          return res.status(404).json({
            message: `Quantité du ${
              item_produit_emplacement.produit.nom_produit
            } dans l'étalage (${
              last_quantite_produit * presentation_quantite
            } ${getNameUniteById(
              item_produit_emplacement.produit.unite_presentation
            )}) est inférieur celle que vous voulez vendre (${quantite_vendue} ${getNameUniteById(
              item_venteDetail.unite_vente
            )})!`,
          });
        }
      }
      let new_quantite_produit = last_quantite_produit - quantite_vendue;
      item_produit_emplacement.set({ quantite_produit: new_quantite_produit });
      await item_produit_emplacement.save({ transaction });

      message.push(
        ` ${
          item_produit_emplacement.produit.nom_produit
        }  :   (${quantite_vendue} ${getNameUniteById(
          item_venteDetail.unite_vente
        )})!`
      );

      //ADD NOTIFICATION
      if (item_produit_emplacement.quantite_produit <= 0.0) {
        console.log("\n\nADD NOTIFICATION\n\n");
        createNewNotification(
          {
            label: `Un produit en étalage épuisé!`,
            details: `Produit ${item_produit_emplacement.produit.nom_produit.toUpperCase()} est en rupture de stock depuis ce ${getDateNow()}.`,
            importance: `warning`,
            icon: `triangle-exclamation`,
          }
          // transaction
        );
      }

      if (index == listVtDtls.length - 1) {
        vente.set({
          date_vente,
          caisse_id,
          caissier_id: utilisateur_id,
          etat_vente: "1",
        });
        await vente.save({ transaction });
        console.log("\n\nADD NOTIFICATION\n\n");
        createNewNotification(
          {
            label: `Vente n° ${item_vente.id} * Validée!`,
            details: `Commande n° ${
              item_vente.id
            } est validé à ${getDateNow()}.`,
            importance: `success`,
            icon: `money-bill-alt`,
          }
          // transaction
        );
        await transaction.commit();
        return res.status(200).json({ message: message.join("\n") });
      }
    });
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    return res.status(404).json({ message: error.message });
  }
};
const updateOneVenteDetail = async (req, res) => {
  const vente = await Vente.findOne({ where: { id: req.params.id } });
  if (!vente)
    return res
      .status(404)
      .json({ message: "Vente #" + req.params.id + " introvable!" });

  const item = await Vente_detail.findOne({
    where: {
      produit_code_lot_produit: req.body.data.code_lot_produit,
      vente_id: req.body.data.vente_id,
    },
  });
  if (!item)
    return res
      .status(404)
      .json({ message: "Cette détails de vente est introvable!" });

  try {
    const last_total = vente.montant_total;
    const last_montant_vente = item.montant_vente;
    const new_montant_vente =
      parseFloat(item.prix_vente) * parseFloat(req.body.data.quantite_vendue);
    const new_montant_total =
      parseFloat(last_total) -
      parseFloat(last_montant_vente) +
      parseFloat(new_montant_vente);
    console.log("\n\nlast_total ", last_total);
    console.log("\nlast_montant_vente ", last_montant_vente);
    console.log("\n\nnew_montant_total ", new_montant_total);
    item.set({
      quantite_vendue: parseFloat(req.body.data.quantite_vendue),
      montant_vente: new_montant_vente,
    });
    await item.save();
    vente.set({
      montant_total: new_montant_total,
    });
    await vente.save();
    return res.status(200).json({
      message:
        "Quantité livré de cette est de " +
        item.quantite_vendue +
        " nouvelle montant total " +
        vente.montant_total,
    });
  } catch (error) {
    console.log(error);
  }
};
const deleteOne = async (req, res) => {
  const item = Vente.findOne({ where: { id: req.params.id } });
  if (!item) return res.status(404).json({ message: "Vente introvable!" });
  try {
    await Vente.destroy({ where: { id: req.params.id } });
    return res.status(200).json({ message: "Vente supprimé avec succès!" });
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  getAllGuichet,
  getAllCaisse,
  getSpecific,
  createOne,
  updateOne,
  deleteOne,
  getAllVenteDetails,
  getGuichetNonLivrer,
  updateOneVenteDetail,
  validateVenteCaisse,
};
