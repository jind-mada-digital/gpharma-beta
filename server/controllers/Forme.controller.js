const Op = require("sequelize").Op;
const Forme = require("../database/models/Forme.model.js");
const Produit = require("../database/models/Produit.model.js");
const getAll = async (req, res) => {
  try {
    const response = await Forme.findAll({ order: [["nom_forme", "ASC"]] });
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};
const getSpecific = async (req, res) => {
  try {
    const response = await Forme.findOne({ where: { id: req.params.id } });
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};

const createOne = async (req, res) => {
  try {
    await Forme.create(req.body);
    res.status(200).send({ message: "Forme ajouté avec succès!" });
  } catch (error) {
    res.status(422).send({ message: error.message });
    console.log(error.message);
  }
};
const updateOne = async (req, res) => {
  const item = await Forme.findOne({ where: { id: req.params.id } });
  if (!item) return res.status(404).send({ message: "Forme introvable!" });
  try {
    item.set(req.body);
    await item.save();
    res.status(201).send({ message: "Forme modifié avec succès!" });
  } catch (error) {
    res.status(422).send({ message: error.message });
    console.log(error.message);
  }
};
const deleteOne = async (req, res) => {
  const itemAll = await Forme.findAll({
    where: {
      [Op.not]: [{ id: req.params.id }],
    },
  });
  if (itemAll.length <= 0)
    return res.status(404).json({
      message:
        "C'est la seule forme enregistrée de votre entreprise; le système a besoin d'au moins une forme pour l'information détailé des produits.",
    });
  const item = await Forme.findOne({ where: { id: req.params.id } });
  if (!item) return res.status(404).json({ message: "Forme introvable!" });
  const itemProduit = await Produit.findAll({
    where: { forme_id: req.params.id },
  });
  if (itemProduit.length > 0) {
    let message = "";
    itemProduit.forEach((element) => {
      message += element.nom_produit + ", ";
    });
    return res.status(404).json({
      message: `La forme **${
        item.nom_forme
      }** ne peut pas être supprimée car il est lié au produit [${message.slice(
        0,
        -2
      )}]!`,
    });
  }
  try {
    await Forme.destroy({ where: { id: req.params.id } });
    return res.status(200).json({ message: "Forme supprimée avec succès!" });
  } catch (error) {
    console.log(error);
  }
};
module.exports = { getAll, getSpecific, createOne, updateOne, deleteOne };
