const Societe = require("../database/models/Societe.model.js");
const { createNewNotification } = require("./Notification.controller.js");
const getAll = async (req, res) => {
  try {
    const response = await Societe.findAll();
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};
const getAllActive = async (req, res) => {
  try {
    const response = await Societe.findAll({ where: { status: "1" } });
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};
const getSpecific = async (req, res) => {
  try {
    const response = await Societe.findOne({ where: { id: req.params.id } });
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};
const createOne = async (req, res) => {
  try {
    const item = await Societe.create(req.body.data);
    res.status(201).send({ message: "Société ajouté avec succès!" });
    createNewNotification({
      label: `Nouvelle Société ajoutée!`,
      details: `La société << ${item.nom_societe} >> est ajoutée comme associée du pharmacie.`,
      importance: `secondary`,
      icon: `hospital-alt`,
    });
  } catch (error) {
    res.status(422).send({ message: error.message });
    console.log(error.message);
  }
};
const updateOne = async (req, res) => {
  const item = await Societe.findOne({
    where: { id: req.params.id },
  });
  if (!item) return res.status(404).json({ message: "Produit introvable!" });
  try {
    item.set(req.body.data);
    item.save();
    return res.status(200).json({
      message: "Société mise à jours avec succès!",
    });
  } catch (error) {
    console.log(error.message);
  }
};

const updateStatus = async (req, res) => {
  const item = await Societe.findOne({
    where: { id: req.params.id },
  });
  if (!item) return res.status(404).json({ message: "Produit introvable!" });
  try {
    item.set(req.body);
    item.save();
    return res.status(200).json({
      message:
        item.nom_societe +
        (req.body.status == "1" ? " activé" : " désactivé") +
        " avec succès!",
    });
  } catch (error) {
    console.log(error.message);
  }
};

const deleteOne = async (req, res) => {
  const item = Societe.findOne({ where: { id: req.params.id } });
  if (!item) return res.status(404).json({ message: "Société introvable!" });
  try {
    await Societe.destroy({ where: { id: req.params.id } });
    return res.status(200).json({ message: "Société supprimé avec succés!" });
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  getAll,
  getSpecific,
  createOne,
  updateOne,
  deleteOne,
  updateStatus,
  getAllActive,
};
