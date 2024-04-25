const Utilisateur = require("../database/models/Utilisateur.model.js");
const bcrypt = require("bcrypt");
const cryptojs = require("crypto-js");
const Produit = require("../database/models/Produit.model.js");
const Notification = require("../database/models/Notification.model.js");
const db = require("../config/Database.js");
const { QueryTypes, Op } = require("sequelize");
const Produit_emplacement = require("../database/models/Produit_emplacement.model.js");
const getDateNow = require("../utils/utils.js").getDateNow;

const updatePeremption = async () => {
  const new_perimee = await db.query(
    `SELECT * FROM produit WHERE status != "2" AND date_peremption >= DATE(NOW())`,
    { type: QueryTypes.SELECT }
  );
  let listNotif = [];
  if (new_perimee.length > 0) {
    console.log("\nnew_perimee\n\n", new_perimee);
    new_perimee.forEach(async (element) => {
      console.log("\n\nADD NOTIFICATION\n\n");
      listNotif.push({
        label: `PEREMPTION / ${element.code_lot_produit} #${element.nom_produit} `,
        details: `Le Produit ${element.nom_produit.toUpperCase()} est périmé depuis ce ${
          element.date_peremption
        }. Il est ne peut plus être étaler!`,
        importance: `danger`,
        icon: `dolly-flatbed`,
      });
    });
    await Notification.bulkCreate(listNotif);
    //UPDATE STATUS 2 PERIMEE
    await db.query(
      `UPDATE produit SET status = "2" WHERE date_peremption >= DATE(NOW())`,
      { type: QueryTypes.UPDATE }
    );
    //DELETE IN PRODUIT EMPLACEMENT
    new_perimee.forEach(async (element) => {
      await Produit_emplacement.destroy({
        where: { code_lot_produit: element.code_lot_produit },
      });
    });
  }
};

const login = async (req, res) => {
  const nom_login = req.body.nom_login;
  const mot_de_passe = req.body.mot_de_passe;
  const user = await Utilisateur.findOne({ where: { nom_login } });
  if (!user)
    return res
      .status(404)
      .json({ message: "Nom d'utilisateur ou mot de passe incorrect!" });
  console.log("\n\nSTART COMPARE AND CRYPTE\n\n");
  bcrypt.compare(mot_de_passe, user.mot_de_passe, async (erreur, result) => {
    if (result) {
      user.set({ date_der_log: getDateNow(), isOnline: "1" });
      await user.save();

      const dataSession = {
        id: user.id,
        type_utilisateur: user.type_utilisateur,
        nom_login: user.nom_login,
        nom_utilisateur: user.nom_utilisateur,
        image: user.image,
        url: user.url,
        mot_de_passe: user.mot_de_passe,
      };
      let dataSessionCrypted = JSON.stringify(dataSession);

      dataSessionCrypted = cryptojs.AES.encrypt(
        dataSessionCrypted,
        process.env.KEY_SESSION
      ).toString();
      console.log("\n\n\n dataSession ", dataSession);
      console.log(
        "\n\n\nJSON.stringify(dataSession)",
        JSON.stringify(dataSession)
      );
      console.log("dataSessionCrypted", dataSessionCrypted);
      res.status(200).send({
        message: "Vous êtes connecté",
        dataUser: JSON.stringify(dataSession),
      });
      console.log("test LOGIN");
      //-------------------------------------------------------CHECK PRODUIT PERIMEE--------------------------------------------------------------
      // updatePeremption();
    } else
      return res
        .status(404)
        .send({ message: "Nom d'utilisateur ou mot de passe incorrect!" });
  });
};

const reloadDataUser = async (req, res) => {
  const user = await Utilisateur.findOne({ where: { id: req.params.id } });
  if (!user)
    return res.status(404).json({ message: "Utilisateur introuvable!" });

  const dataSession = {
    id: user.id,
    type_utilisateur: user.type_utilisateur,
    nom_login: user.nom_login,
    nom_utilisateur: user.nom_utilisateur,
    url: user.url,
    image: user.image,
    mot_de_passe: user.mot_de_passe,
  };
  let dataSessionCrypted = JSON.stringify(dataSession);

  dataSessionCrypted = cryptojs.AES.encrypt(
    dataSessionCrypted,
    process.env.KEY_SESSION
  ).toString();
  console.log("dataSessionCrypted", dataSessionCrypted);
  // localStorage.setItem("gpharma@2.0.0", JSON.stringify(dataSession));
  return res.status(200).send({ dataUser: JSON.stringify(dataSession) });
};

const logout = async (req, res) => {
  const user = await Utilisateur.findOne({
    where: { id: req.params.id },
  });
  if (!user)
    return res.status(404).json({ message: "Utilisateur introvable!" });
  try {
    user.set({ date_der_log: getDateNow(), isOnline: "0" });
    await user.save();
    return res.status(200).send({ message: "Vous êtes déconnecté" });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};
module.exports = { login, logout, reloadDataUser };
