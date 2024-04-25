const Op = require("sequelize").Op;
const Produit = require("../database/models/Produit.model.js");
const Unite = require("../database/models/Unite.model.js");
const getAll = async (req, res) => {
  try {
    const response = await Unite.findAll({ order: [["nom_unite", "ASC"]] });
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};
const getSpecific = async (req, res) => {
  try {
    const response = await Unite.findOne({ where: { id: req.params.id } });
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};

const createOne = async (req, res) => {
  try {
    await Unite.create(req.body);
    res.status(200).send({ message: "Unité ajouté avec succès!" });
  } catch (error) {
    res.status(422).send({ message: error.message });
    console.log(error.message);
  }
};
const updateOne = async (req, res) => {
  const item = await Unite.findOne({ where: { id: req.params.id } });
  if (!item) return res.status(404).json({ message: "Unite introvable!" });
  try {
    item.set(req.body);
    await item.save();
    res.status(201).send({ message: "Unite modifié avec succès!" });
  } catch (error) {
    res.status(422).send({ message: error.message });
    console.log(error.message);
  }
};
const deleteOne = async (req, res) => {
  const itemAll = await Unite.findAll({
    where: {
      [Op.not]: [{ id: req.params.id }],
    },
  });
  if (itemAll.length <= 0)
    return res.status(404).json({
      message:
        "C'est le seul unité enregistré de votre entreprise; le système a besoin d'au moins un unité pour l'information détailé des produits.",
    });
  const item = await Unite.findOne({ where: { id: req.params.id } });
  if (!item) return res.status(404).json({ message: "Unité introvable!" });
  const itemProduit = await Produit.findAll({
    where: {
      [Op.or]: [
        {
          unite_presentation: req.params.id,
        },
        { unite_achat: req.params.id },
        { unite_stock: req.params.id },
        { unite_vente: req.params.id },
      ],
    },
  });
  if (itemProduit.length > 0) {
    let message = "";
    itemProduit.forEach((element) => {
      message += element.nom_produit + ", ";
    });
    return res.status(404).json({
      message: `L'unité **${
        item.nom_unite
      }** ne peut pas être supprimée car il est lié au produit [${message.slice(
        0,
        -2
      )}]!`,
    });
  }
  try {
    await Unite.destroy({ where: { id: req.params.id } });
    return res.status(200).json({ message: "Unite supprimé avec succès!" });
  } catch (error) {
    console.log(error);
  }
};
module.exports = { getAll, getSpecific, createOne, updateOne, deleteOne };
