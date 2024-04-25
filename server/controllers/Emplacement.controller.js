const Emplacement = require("../database/models/Emplacement.model.js");
const getAll = async (req, res) => {
  try {
    const response = await Emplacement.findAll();
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};
const getSpecific = async (req, res) => {
  try {
    const response = await Emplacement.findOne({
      where: { id: req.params.id },
    });
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};
const createOne = async (req, res) => {
  try {
    await Emplacement.create(req.body);
    res.status(200).send({ message: "Emplacement ajouté avec succès!" });
  } catch (error) {
    res.status(422).send({ message: error.message });
    console.log(error.message);
  }
};
const updateOne = async (req, res) => {
  const item = await Emplacement.findOne({ where: { id: req.params.id } });
  if (!item)
    return res.status(404).json({ message: "Emplacement introvable!" });
  try {
    item.set(req.body);
    await item.save();
    res.status(201).send({ message: "Emplacement modifié avec succès!" });
  } catch (error) {
    res.status(422).send({ message: error.message });
    console.log(error.message);
  }
};
const deleteOne = async (req, res) => {
  const user = Emplacement.findOne({ where: { id: req.params.id } });
  if (!user)
    return res.status(404).json({ message: "Emplacement introvable!" });
  try {
    await Emplacement.destroy({ where: { id: req.params.id } });
    return res
      .status(200)
      .json({ message: "Emplacement supprimé avec succès!" });
  } catch (error) {
    console.log(error);
  }
};
module.exports = { getAll, getSpecific, createOne, updateOne, deleteOne };
