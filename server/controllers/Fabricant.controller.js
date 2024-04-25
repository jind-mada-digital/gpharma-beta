const Op = require("sequelize").Op;
const Fabricant = require("../database/models/Fabricant.model.js");
const Produit = require("../database/models/Produit.model.js");
const getAll = async (req, res) => {
  try {
    const response = await Fabricant.findAll({
      order: [["nom_fabricant", "ASC"]],
    });
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};
const getSpecific = async (req, res) => {
  try {
    const response = await Fabricant.findOne({ where: { id: req.params.id } });
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};

const createOne = async (req, res) => {
  try {
    await Caisse.create(req.body);
    res.status(200).send({ message: "Caisse ajouté avec succès!" });
  } catch (error) {
    res.status(422).send({ message: error.message });
    console.log(error.message);
  }
};
const updateOne = async (req, res) => {
  const item = await Fabricant.findOne({ where: { id: req.params.id } });
  if (!item) return res.status(404).json({ message: "Fabricant introvable!" });
  try {
    item.set(req.body);
    await item.save();
    res.status(201).send({ message: "Fabricant modifié avec succès!" });
  } catch (error) {
    res.status(422).send({ message: error.message });
    console.log(error.message);
  }
};
const deleteOne = async (req, res) => {
  const itemAll = await Fabricant.findAll({
    where: {
      [Op.not]: [{ id: req.params.id }],
    },
  });
  if (itemAll.length <= 0)
    return res.status(404).json({
      message:
        "C'est le seul fabricant enregistré de votre entreprise; le système a besoin d'au moins un fabricant pour l'information détailé des produits.",
    });
  const item = await Fabricant.findOne({ where: { id: req.params.id } });
  if (!item) return res.status(404).json({ message: "Fabricant introvable!" });
  const itemProduit = await Produit.findAll({
    where: { fabricant_id: req.params.id },
  });
  if (itemProduit.length > 0) {
    let message = "";
    itemProduit.forEach((element) => {
      message += element.nom_produit + ", ";
    });
    return res.status(404).json({
      message: `Le fabricant **${
        item.nom_fabricant
      }** ne peut pas être supprimé car il est lié au produit [${message.slice(
        0,
        -2
      )}]!`,
    });
  }
  try {
    await Fabricant.destroy({ where: { id: req.params.id } });
    return res.status(200).json({ message: "Fabricant supprimé avec succès!" });
  } catch (error) {
    console.log(error);
  }
};
module.exports = { getAll, getSpecific, createOne, updateOne, deleteOne };
