const Op = require("sequelize").Op;
const Produit = require("../database/models/Produit.model.js");
const Voie = require("../database/models/Voie.model.js");

const getAll = async (req, res) => {
  try {
    const response = await Voie.findAll({ order: [["nom_voie", "ASC"]] });
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};
const getSpecific = async (req, res) => {
  try {
    const response = await Voie.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};

const createOne = async (req, res) => {
  try {
    await Voie.create(req.body);
    res.status(200).send({ message: "Voie ajoutée avec succès!" });
  } catch (error) {
    res.status(422).send({ message: error.message });
    console.log(error.message);
  }
};
const updateOne = async (req, res) => {
  const item = await Voie.findOne({ where: { id: req.params.id } });
  if (!item) return res.status(404).json({ message: "Voie introvable!" });
  try {
    item.set(req.body);
    await item.save();
    res.status(201).send({ message: "Voie modifié avec succès!" });
  } catch (error) {
    res.status(422).send({ message: error.message });
    console.log(error.message);
  }
};
const deleteOne = async (req, res) => {
  const itemAll = await Voie.findAll({
    where: {
      [Op.not]: [{ id: req.params.id }],
    },
  });
  if (itemAll.length <= 0)
    return res.status(404).json({
      message:
        "C'est la seule voie enregistrée de votre entreprise; le système a besoin d'au moins une voie pour l'information détailé des produits.",
    });
  const item = await Voie.findOne({ where: { id: req.params.id } });
  if (!item) return res.status(404).json({ message: "Voie introvable!" });
  const itemProduit = await Produit.findAll({
    where: { voie_id: req.params.id },
  });
  if (itemProduit.length > 0) {
    let message = "";
    itemProduit.forEach((element) => {
      message += element.nom_produit + ", ";
    });
    return res.status(404).json({
      message: `La voie **${
        item.nom_voie
      }** ne peut pas être supprimée car il est lié au produit [${message.slice(
        0,
        -2
      )}]!`,
    });
  }
  try {
    await Voie.destroy({
      where: {
        id: req.params.id,
      },
    });
    return res.status(200).json({ message: "Voie supprimée avec succès!" });
  } catch (error) {
    console.log(error);
  }
};
module.exports = { getAll, getSpecific, createOne, updateOne, deleteOne };
