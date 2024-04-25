const Op = require("sequelize").Op;
const Mode_expedition = require("../database/models/Mode_expedition.model.js");
const getAll = async (req, res) => {
  try {
    const response = await Mode_expedition.findAll({
      order: [["nom_mode_expedition", "ASC"]],
    });
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};
const getSpecific = async (req, res) => {
  try {
    const response = await Mode_expedition.findOne({
      where: { id: req.params.id },
    });
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};

const createOne = async (req, res) => {
  try {
    await Mode_expedition.create(req.body);
    res.status(200).send({ message: "Mode d'expédition ajouté avec succès!" });
  } catch (error) {
    res.status(422).send({ message: error.message });
    console.log(error.message);
  }
};
const updateOne = async (req, res) => {
  const item = await Mode_expedition.findOne({ where: { id: req.params.id } });
  if (!item)
    return res.status(404).json({ message: "Mode d'expédition introvable!" });
  try {
    item.set(req.body);
    await item.save();
    res.status(201).send({ message: "Mode d'expédition modifié avec succès!" });
  } catch (error) {
    res.status(422).send({ message: error.message });
    console.log(error.message);
  }
};
const deleteOne = async (req, res) => {
  const itemAll = await Mode_expedition.findAll({
    where: {
      [Op.not]: [{ id: req.params.id }],
    },
  });
  if (itemAll.length <= 0)
    return res.status(404).json({
      message:
        "C'est la seule mode d'expedition de votre entreprise; le système a besoin d'au moins une mode d'expedition pour le ravitaillement des produits.",
    });
  const item = await Mode_expedition.findOne({ where: { id: req.params.id } });
  if (!item)
    return res.status(404).json({ message: "Mode d'expédition introvable!" });
  try {
    await Mode_expedition.destroy({ where: { id: req.params.id } });
    return res
      .status(200)
      .json({ message: "Mode d'expédition supprimée avec succès!" });
  } catch (error) {
    console.log(error);
  }
};
module.exports = { getAll, getSpecific, createOne, updateOne, deleteOne };
