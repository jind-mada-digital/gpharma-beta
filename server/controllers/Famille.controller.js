const Op = require("sequelize").Op;
const Famille = require("../database/models/Famille.model.js");
const Produit = require("../database/models/Produit.model.js");
const getAll = async (req, res) => {
  try {
    const response = await Famille.findAll({ order: [["nom_famille", "ASC"]] });
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};
const getSpecific = async (req, res) => {
  try {
    const response = await Famille.findOne({ where: { id: req.params.id } });
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};

const createOne = async (req, res) => {
  try {
    await Famille.create(req.body);
    res.status(200).send({ message: "Famille ajouté avec succès!" });
  } catch (error) {
    res.status(422).send({ message: error.message });
    console.log(error.message);
  }
};
const updateOne = async (req, res) => {
  const item = await Famille.findOne({ where: { id: req.params.id } });
  if (!item) return res.status(404).send({ message: "Famille introvable!" });
  try {
    item.set(req.body);
    await item.save();
    res.status(201).send({ message: "Famille modifié avec succès!" });
  } catch (error) {
    res.status(422).send({ message: error.message });
    console.log(error.message);
  }
};
const deleteOne = async (req, res) => {
  const itemAll = await Famille.findAll({
    where: {
      [Op.not]: [{ id: req.params.id }],
    },
  });
  if (itemAll.length <= 0)
    return res.status(404).json({
      message:
        "C'est le seule famille enregistrée de votre entreprise; le système a besoin d'au moins une famille pour l'information détailé des produits.",
    });
  const item = await Famille.findOne({ where: { id: req.params.id } });
  if (!item) return res.status(404).json({ message: "Famille introvable!" });
  const itemProduit = await Produit.findAll({
    where: { famille_id: req.params.id },
  });
  if (itemProduit.length > 0) {
    let message = "";
    itemProduit.forEach((element) => {
      message += element.nom_produit + ", ";
    });
    return res.status(404).json({
      message: `La famille **${
        item.nom_famille
      }** ne peut pas être supprimée car il est lié au produit [${message.slice(
        0,
        -2
      )}]!`,
    });
  }
  try {
    await Famille.destroy({ where: { id: req.params.id } });
    return res.status(200).json({ message: "Famille supprimée avec succès!" });
  } catch (error) {
    console.log(error);
  }
};
module.exports = { getAll, getSpecific, createOne, updateOne, deleteOne };
