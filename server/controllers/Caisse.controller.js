const Op = require("sequelize").Op;
const Caisse = require("../database/models/Caisse.model.js");

const getAll = async (req, res) => {
  try {
    const response = await Caisse.findAll({ order: [["nom_caisse", "ASC"]] });
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};
const getSpecific = async (req, res) => {
  try {
    const response = await Caisse.findOne({ where: { id: req.params.id } });
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
  const item = await Caisse.findOne({ where: { id: req.params.id } });
  if (!item) return res.status(404).send({ message: "Caisse introvable!" });
  try {
    console.log("item", item);
    item.set(req.body);
    await item.save();
    res.status(201).send({ message: "Caisse modifié avec succès!" });
  } catch (error) {
    res.status(422).send({ message: error.message });
    console.log(error.message);
  }
};
const deleteOne = async (req, res) => {
  const itemAll = await Caisse.findAll({
    where: {
      [Op.not]: [{ id: req.params.id }],
    },
  });
  if (itemAll.length <= 0)
    return res.status(404).json({
      message:
        "C'est la seule caisse de votre entreprise; le système a besoin d'au moins une caisse pour la vente et le ravitaillement des produits.",
    });
  const item = await Caisse.findOne({ where: { id: req.params.id } });
  if (!item) return res.status(404).json({ message: "Caisse introvable!" });
  try {
    await Caisse.destroy({ where: { id: req.params.id } });
    return res.status(200).json({ message: "Caisse supprimé avec succès!" });
  } catch (error) {
    console.log(error);
  }
};
module.exports = { getAll, getSpecific, createOne, updateOne, deleteOne };
