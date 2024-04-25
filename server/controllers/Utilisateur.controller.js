const Utilisateur = require("../database/models/Utilisateur.model.js");
const fs = require("fs");
const bcrypt = require("bcrypt");
const bcryptData = require("../utils/utils.js").bcryptData;
const uploadFile = require("../utils/utils.js").uploadFile;
const Op = require("sequelize").Op;

const getAll = async (req, res) => {
  try {
    const response = await Utilisateur.findAll({
      where: {
        [Op.not]: [{ id: "1" }],
        [Op.not]: [{ id: req.params.id }],
      },
      order: [["date_der_log", "DESC"]],
    });
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};
const getSpecific = async (req, res) => {
  try {
    const response = await Utilisateur.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};
const createOne = (req, res) => {
  let userData = JSON.parse(req.body.data);
  const insertDB = async () => {
    try {
      userData["mot_de_passe"] = bcryptData(userData["mot_de_passe"]);
      await Utilisateur.create(userData);
      res.status(201).send({ message: "Utilisateur ajouté avec succès!" });
    } catch (error) {
      res.status(422).send({ message: error.message });
      console.log(error.message);
    }
  };
  userData["mot_de_passe"] = userData["mot_de_passe"];
  if (!req.files) {
    console.log("sans image");
    insertDB();
  } else {
    uploadFile(req, res, "USER_", "images/utilisateur", userData, insertDB);
  }
};
const createMany = () => {};
const updateOne = async (req, res) => {
  console.log("files", req.files);
  console.log("data", req.body);
  const user = await Utilisateur.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!user)
    return res.status(404).send({ message: "Utilisateur introvable!" });
  let userData = {};
  if (req.body.data) userData = JSON.parse(req.body.data);
  let fileName = "";
  let url = "";
  if (!req.files) {
    fileName = user.image;
    url = user.url;
    userData["image"] = fileName;
    userData["url"] = url;
  } else {
    uploadFile(
      req,
      res,
      "USER_",
      "images/utilisateur",
      userData,
      null,
      user.image ? user.image : ""
    );
  }
  try {
    if (userData["mot_de_passe"])
      userData["mot_de_passe"] = bcryptData(userData["mot_de_passe"]);
    user.set(userData);
    await user.save();
    res.status(201).send({ message: "Utilisateur modifié avec succès!" });
  } catch (error) {
    res.status(422).send({ message: error.message });
    console.log(error.message);
  }
};
const deleteOne = async (req, res) => {
  const user = await Utilisateur.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!user)
    return res.status(404).send({ message: "Utilisateur introvable!" });
  try {
    if (user.isOnline == "1")
      return res
        .status(404)
        .send({ message: "L'utilisateur est encore en ligne." });
    if (user.image) {
      const filepath = `./public/images/utilisateur/${user.image}`;
      // Check if file exist
      fs.access(filepath, fs.F_OK, (err) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log("N DETETED -- ", user.url);
        fs.unlinkSync(filepath);
        //file exists
      });
    }
    await Utilisateur.destroy({
      where: {
        id: req.params.id,
      },
    });
    return res
      .status(200)
      .json({ message: "Utilisateur supprimé avec succès!" });
  } catch (error) {
    console.log(error);
  }
};
const changePwd = async (req, res) => {
  const user = await Utilisateur.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!user)
    return res.status(404).send({ message: "Utilisateur introvable!" });
  let data = req.body;
  bcrypt.compare(data.last_mot_de_passe, user.mot_de_passe, (err, result) => {
    if (!result)
      res.status(422).send({ message: "Ancien mot de passe incorrect!" });
  });
  try {
    data.mot_de_passe = bcryptData(data.mot_de_passe);
    user.set({ mot_de_passe: data.mot_de_passe });
    await user.save();
    res.status(201).send({ message: "Mot de passe mise à jour!" });
  } catch (error) {
    // res.status(422).send({ message: error.message });
    console.log(error.message);
  }
};
module.exports = {
  getAll,
  getSpecific,
  createOne,
  createMany,
  updateOne,
  deleteOne,
  changePwd,
};
