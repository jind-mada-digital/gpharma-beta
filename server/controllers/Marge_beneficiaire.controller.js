const Op = require("sequelize").Op;
const Marge_beneficiaire = require("../database/models/Marge_beneficiaire.model.js");
const { createNewNotification } = require("./Notification.controller.js");
const getAll = async (req, res) => {
  try {
    const response = await Marge_beneficiaire.findAll({
      order: [["marge_beneficiaire", "ASC"]],
    });
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};
const getActive = async (req, res) => {
  try {
    const response = await Marge_beneficiaire.findOne({
      where: { active: "1" },
    });
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};
const getSpecific = async (req, res) => {
  try {
    const response = await Marge_beneficiaire.findOne({
      where: { id: req.params.id },
    });
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};
const createOne = async (req, res) => {
  try {
    const item = await Marge_beneficiaire.create(req.body.data);
    if (!item)
      return res.status(404).json({ message: "Une erreur est survénue." });
    await Marge_beneficiaire.update(
      { active: "0" },
      {
        where: {
          [Op.not]: [{ id: item.id }],
        },
      }
    );
    res.status(200).json({ message: "Marge bénéficiaire créée avec succès." });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: error.message });
  }
};
const updateOne = async (req, res) => {
  const item = await Marge_beneficiaire.findOne({
    where: { id: req.params.id },
  });
  if (!item)
    return res.status(404).json({ message: "Une erreur est survénue." });
  try {
    console.log("\n\nreq.body.data", req.body.data);
    item.set(req.body.data);
    await item.save();
    return res.status(200).json({
      message: "Marge bénéficiaire modifiée avec succès!",
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: error.message });
  }
};
const updateStatus = async (req, res) => {
  const item = await Marge_beneficiaire.findOne({
    where: { id: req.params.id },
  });
  if (!item)
    return res.status(404).json({ message: "Une erreur est survénue." });
  try {
    if (item.active == "1" && item.status == "1")
      return res.status(404).json({
        message:
          "Cette marge bénéficiaire est utilisée par défaut actuellement.",
      });
    item.set(req.body);
    await item.save();
    return res.status(200).json({
      message:
        "Marge bénéficiaire " +
        (req.body.status == "1" ? " activé" : " désactivé") +
        " avec succès!",
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: error.message });
  }
};
const updateActive = async (req, res) => {
  const item = await Marge_beneficiaire.findOne({
    where: { id: req.params.id },
  });
  if (!item)
    return res.status(404).json({ message: "Une erreur est survénue." });
  try {
    item.set(req.body);
    await item.save();
    await Marge_beneficiaire.update(
      { active: "0" },
      {
        where: {
          [Op.not]: [{ id: item.id }],
        },
      }
    );
    createNewNotification({
      label: `Marge bénéficiaire changée!`,
      details:
        "Marge bénéficiaire **" +
        item.marge_beneficiaire +
        "** choisis par défaut",
      importance: `info`,
      icon: `line-chart`,
    });
    return res.status(200).json({
      message:
        "Marge bénéficiaire **" +
        item.marge_beneficiaire +
        "** choisis par défaut",
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: error.message });
  }
};
const deleteOne = async (req, res) => {
  const item = Marge_beneficiaire.findOne({ where: { id: req.params.id } });
  if (!item)
    return res.status(404).json({ message: "Marge_beneficiaire introvable!" });
  try {
    await Marge_beneficiaire.destroy({ where: { id: req.params.id } });
    return res
      .status(200)
      .json({ message: "Marge_beneficiaire supprimé avec succès!" });
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
  updateActive,
  updateStatus,
  getActive,
};
