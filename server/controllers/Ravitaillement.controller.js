const db = require("../config/Database.js");
const Caisse = require("../database/models/Caisse.model.js");
const Fournisseur = require("../database/models/Fournisseur.model.js");
const Mode_expedition = require("../database/models/Mode_expedition.model.js");
const Produit = require("../database/models/Produit.model.js");
const Produit_emplacement = require("../database/models/Produit_emplacement.model.js");
const Ravitaillement = require("../database/models/Ravitaillement.model.js");
const Ravitaillement_detail = require("../database/models/Ravitaillement_detail.model.js");
const Unite = require("../database/models/Unite.model.js");
const Utilisateur = require("../database/models/Utilisateur.model.js");
const { createNewNotification } = require("./Notification.controller.js");
const convertEngDayMonth =
  require("../utils/nizwami-ibrahim/ConvertEngDayMonth.js").convertEngDayMonth;
const getDateNow = require("../utils/utils.js").getDateNow;
const getAll = async (req, res) => {
  try {
    let response = await Ravitaillement.findAll({
      attributes: {
        include: [
          [
            db.fn("DATE_FORMAT", db.col("date_saisi"), " %W %d %M %Y à %Hh%i"),
            "date_saisi",
          ],
          [
            db.fn(
              "DATE_FORMAT",
              db.col("date_prev_livraison"),
              " %W %d %M %Y à %Hh%i"
            ),
            "date_prev_livraison",
          ],
          [
            db.fn(
              "DATE_FORMAT",
              db.col("date_livraison"),
              " %W %d %M %Y à %Hh%i"
            ),
            "date_livraison",
          ],
        ],
      },
      include: [
        { model: Fournisseur },
        { model: Mode_expedition },
        { model: Caisse },
        { model: Utilisateur },
      ],
    });
    let resp = [];
    if (response.length > 0)
      response.map((element) => {
        element = {
          ...element.dataValues,
          ["date_saisi"]: convertEngDayMonth(element.date_saisi),
          ["date_prev_livraison"]: convertEngDayMonth(
            element.date_prev_livraison
          ),
          ["date_livraison"]: convertEngDayMonth(element.date_livraison),
        };
        resp.push(element);
      });
    res.json(resp);
  } catch (error) {
    console.log(error.message);
  }
};
const getSpecific = async (req, res) => {
  try {
    const dataRvt = await Ravitaillement.findOne({
      attributes: {
        include: [
          [
            db.fn("DATE_FORMAT", db.col("date_saisi"), " %W %d %M %Y à %Hh%i"),
            "date_saisi",
          ],
          [
            db.fn(
              "DATE_FORMAT",
              db.col("date_prev_livraison"),
              " %W %d %M %Y "
            ),
            "date_prev_livraison",
          ],
          [
            db.fn("DATE_FORMAT", db.col("date_livraison"), " %W %d %M %Y "),
            "date_livraison",
          ],
        ],
      },
      where: { id: req.params.id },
      include: [
        { model: Fournisseur },
        { model: Mode_expedition },
        { model: Caisse },
        { model: Utilisateur },
      ],
    });
    let response = {};
    if (dataRvt)
      response = {
        ...dataRvt.dataValues,
        ["date_saisi"]: convertEngDayMonth(dataRvt.date_saisi),
        ["date_prev_livraison"]: convertEngDayMonth(
          dataRvt.date_prev_livraison
        ),
        ["date_livraison"]: convertEngDayMonth(dataRvt.date_livraison),
      };
    const dataRvtDetail = await Ravitaillement_detail.findAll({
      where: { ravitaillement_id: req.params.id },
      include: [{ model: Produit }, { model: Unite }],
    });
    if (dataRvt || dataRvtDetail) res.json([response, dataRvtDetail]);
  } catch (error) {
    console.log(error.message);
  }
};
const createOne = async (req, res) => {
  const { dataRvt, dataRvtDetail } = req.body;
  try {
    const newRvt = await Ravitaillement.create({ ...dataRvt, caisse_id: null });
    if (newRvt) {
      dataRvtDetail.map((item) => {
        item.ravitaillement_id = newRvt.id;
      });
      console.log("\n\n\n\n\n", dataRvtDetail, "\n\n\n\n\n");

      await Ravitaillement_detail.bulkCreate(dataRvtDetail);
      createNewNotification({
        label: `Ravitaillement n° ${newRvt.id} * ajouté (Non valider)!`,
        details: `Ravitaillement n° ${newRvt.id} motif << ${newRvt.motif} >> ajouté avec [${dataRvtDetail.length}] produit(s) commandé(s).`,
        importance: `secondary`,
        icon: `shipping-fast`,
      });
      return res
        .status(200)
        .json({ message: "Tous les produits sont commandés!" });
    }
  } catch (error) {
    console.log(error);
    return res.status(422).json({ message: error.message });
  }
};
const updateOne = async (req, res) => {};

const updateOneRavitaillementDetail = async (req, res) => {
  const rvt = await Ravitaillement.findOne({ where: { id: req.params.id } });
  if (!rvt)
    return res.status(404).json({ message: "Ravitaillement introvable!" });

  const item = await Ravitaillement_detail.findOne({
    where: {
      produit_code_lot_produit: req.body.data.code_lot_produit,
      ravitaillement_id: req.body.data.ravitaillement_id,
    },
  });
  if (!item)
    return res
      .status(404)
      .json({ message: "Cette détails de ravitaillement est introvable!" });

  try {
    const last_total = rvt.montant_ht;
    const last_montant_ht = item.montant_ht;
    const new_montant_ht =
      parseFloat(item.prix_unit) * parseFloat(req.body.data.quantite_livraison);
    const new_montant_total =
      parseFloat(last_total) -
      parseFloat(last_montant_ht) +
      parseFloat(new_montant_ht);
    console.log("\n\nlast_total ", last_total);
    console.log("\nlast_montant_ht ", last_montant_ht);
    console.log("\n\nnew_montant_total ", new_montant_total);
    item.set({
      quantite_livraison: req.body.data.quantite_livraison,
      montant_ht: new_montant_ht,
    });
    await item.save();
    rvt.set({ montant_ht: new_montant_total });
    await rvt.save();

    return res.status(200).json({
      message: "Quantité livré de cette est de " + item.quantite_livraison,
    });
  } catch (error) {
    console.log(error);
  }
};
const validateRavitaillement = async (req, res) => {
  const rvt = await Ravitaillement.findOne({ where: { id: req.params.id } });
  if (!rvt)
    return res.status(404).json({ message: "Ravitaillement introvable!" });

  try {
    const dataRvtDetail = await Ravitaillement_detail.findAll({
      where: { ravitaillement_id: req.params.id },
      include: [{ model: Produit }, { model: Unite }],
    });
    let messages = "";
    dataRvtDetail.forEach(async (item_rvtDetail) => {
      const item_produit = await Produit.findOne({
        where: { code_lot_produit: item_rvtDetail.produit_code_lot_produit },
      });
      const item_produit_emplacement = await Produit_emplacement.findOne({
        where: {
          produit_code_lot_produit: item_rvtDetail.produit_code_lot_produit,
          emplacement_id: 1,
        },
      });
      if (item_produit.unite_stock !== item_rvtDetail.unite_achat) {
        return res.status(404).json({
          message: `La mise à jour du quantité du produit **${item_produit.nom_produit}** a échoué : 
          L'unité de stockage et l'unité d'achat non identique. 
          (Veuillez mette à niveau l'unité de stockage). `,
        });
      }

      let last_quantite_stock = item_produit.quantite_stock;
      let new_qte_stock =
        parseFloat(item_produit.quantite_stock) +
        parseFloat(item_rvtDetail.quantite_livraison);
      let new_qte_stock_PE =
        parseFloat(item_produit_emplacement.quantite_produit) +
        parseFloat(item_rvtDetail.quantite_livraison);
      item_produit.set({ quantite_stock: new_qte_stock });
      item_produit_emplacement.set({
        quantite_produit: new_qte_stock_PE,
        quantite_der_depot: item_rvtDetail.quantite_livraison,
        date_der_depot: getDateNow(),
      });
      item_produit.save();
      item_produit_emplacement.save();
      messages += `**${item_produit.nom_produit}**: quantité en stock (principale + etalé) de **${last_quantite_stock}** à **${item_produit.quantite_stock}**\n`;
    });

    rvt.set({
      etat_ravitaillement: "LIVREE",
      caisse_id: req.body.caisse_id,
      montant_ht: req.body.montant_ht,
      date_livraison: req.body.date_livraison,
    });
    await rvt.save();
    createNewNotification({
      label: `Ravitaillement n° ${rvt.id} * livré!`,
      details: `Ravitaillement n° ${rvt.id} motif << ${rvt.motif} >> livré avec [${dataRvtDetail.length}] produit(s) livré(s).`,
      importance: `secondary`,
      icon: `shipping-fast`,
    });
    console.log("\n\n\n\n\n", rvt, "\n\n\n\n\n");

    return res.status(200).json({
      message: "Commandes livrées : " + messages,
    });
  } catch (error) {
    console.log(error);
  }
};

const deleteOne = async (req, res) => {
  const item = await Ravitaillement.findOne({ where: { id: req.params.id } });
  if (!item)
    return res.status(404).json({ message: "Ravitaillement introvable!" });
  try {
    await Ravitaillement.destroy({ where: { id: req.params.id } });
    createNewNotification({
      label: `Ravitaillement n° ${newRvt.id} * supprimé!`,
      details: `Ravitaillement n° ${newRvt.id} de motif << ${newRvt.motif} >> supprimé.`,
      importance: `secondary`,
      icon: `shipping-fast`,
    });
    return res
      .status(200)
      .json({ message: "Ravitaillement supprimé avec succès!" });
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  getAll,
  getSpecific,
  createOne,
  updateOne,
  updateOneRavitaillementDetail,
  validateRavitaillement,
  deleteOne,
};
